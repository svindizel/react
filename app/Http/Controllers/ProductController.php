<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Products;
use App\Models\Articles;
use App\Models\ProductDescription;
use App\Post;
use Illuminate\Support\Arr;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{

    protected function validateFields(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'art' => ['required', 'string', 'max:255'],
            'price' => ['required', 'max:255'],
        ]);
    }

    public function authCheck()
    {
        return response()->json(['auth' => Auth::check()]);
    }

    public function getAddictions()
    {
        return new JsonResponse(response()->json([
            'categories' => DB::table('categories')->select('id', 'name')->get()->toArray(),
            'units' => DB::table('units')->select('id', 'name')->get()->toArray()
        ]), 200);
    }

    public function getProducts()
    {
        $products = Products::all()->toArray();

        for ($i = 0; $i < count($products); $i++)
        {
            $products[$i] = Arr::add($products[$i], 'category_id', DB::table('categories')
                ->select('id')
                ->where('id', DB::table('category_to_products')
                ->select('category_id')
                ->where('product_id', $products[$i]['id'])
                ->value('id'))
                ->value('product_id')
            );

            $products[$i] = Arr::add($products[$i], 'category', DB::table('categories')
            ->select('name')
            ->where('id', DB::table('category_to_products')
            ->select('category_id')
            ->where('product_id', $products[$i]['id'])
            ->value('id'))
            ->value('product_id')
        );

            $products[$i] = Arr::add($products[$i], 'art', DB::table('articles')
                ->select('art')
                ->where('id', DB::table('products')
                ->select('art_id')
                ->where('id', $products[$i]['id'])
                ->value('art_id'))
                ->value('art')
            );

            $products[$i] = Arr::add($products[$i], 'name', DB::table('product_descriptions')
                ->select('name')
                ->where('product_id', DB::table('products')
                ->select('id')
                ->where('id', $products[$i]['id'])
                ->value('id'))
                ->value('name')
            );

            $products[$i] = Arr::add($products[$i], 'description', DB::table('product_descriptions')
                ->select('description')
                ->where('product_id', DB::table('products')
                ->select('id')
                ->where('id', $products[$i]['id'])
                ->value('id'))
                ->value('description')
            );

            $products[$i] = Arr::add($products[$i], 'unit', DB::table('units')
                ->select('name')
                ->where('id', $products[$i]['unit_id'])
                ->value('name')
            );
        }
        /*dd(DB::table('products')
        ->join('articles', 'products.art_id', '=', 'articles.id')
        ->join('product_descriptions', 'products.id', '=', 'product_descriptions.product_id')
        ->join('category_to_products', 'products.id', '=', 'category_to_products.product_id')
        ->join('units', 'products.unit_id', '=', 'units.id')
        ->join('categories', 'category_to_products.category_id', '=', 'categories.id')
        ->select('products.id', 'products.price', 'products.is_over', 'product_descriptions.name', 'articles.art', 'product_descriptions.description', 'category_to_products.id', 'categories.name', 'units.name', 'categories.id', 'units.id')
        ->get());*/

        return new JsonResponse(response()->json($products), 200);
    }

    public function create(Request $request)
    {
        $this->validateFields($request->all())->validate();

        if (Articles::where('art', $request->art)->exists()) {
            return new JsonResponse(response()->json('Article is exists'), 422);
        }

        Articles::create(['art' => $request->art]);

        $art_id = DB::table('articles')->select('id')->where('art', $request->art)->value('id');
    
        $product_id = Products::create([
            'price' => $request->price,
            'art_id' => $art_id,
            'is_over' => 0,
            'status' => 0,
            'unit_id' => $request->unit_id
        ])->id;

        ProductDescription::create([
            'name' => $request->name,
            'description' => $request->description,
            'product_id' => $product_id
        ]);

        DB::table('category_to_products')->insert([
            'product_id' => $product_id,
            'category_id' => $request->category_id
        ]);

        return $this->getProducts();
    }

    public function update(Request $request)
    {
        $this->validateFields($request->all())->validate();
        
/*
        if (Articles::where('art', $request->art)->exists()) {
            return new JsonResponse(response()->json('Article is exists'), 200);
        }*/

        Articles::where('id', Products::where('id', $request->id)
            ->value('art_id')
        )
        ->update([
            'art' => $request->art
        ]);

        Products::where('id', $request->id)
        ->update([
            'price' => $request->price,
            'unit_id' => $request->unit_id
        ]);
        
        ProductDescription::where('product_id', $request->id)
        ->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);
        
        DB::table('category_to_products')
        ->where('product_id', $request->id)
        ->update([
            'category_id' => $request->category_id
        ]);
        
        return $this->getProducts();
    }

    public function delete(Request $request)
    {
        $art_id = Products::where('id', $request->id)->value('art_id');
            
        ProductDescription::where('product_id', $request->id)
            ->delete();

        DB::table('category_to_products')
            ->where('product_id', $request->id)
            ->delete();

        Products::where('id', $request->id)
            ->delete();

        Articles::where('id', $art_id)
            ->delete();

        return $this->getProducts();
    }
}