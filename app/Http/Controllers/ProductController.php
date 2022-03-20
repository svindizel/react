<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Products;
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
            'price' => ['required', 'string', 'max:255'],
            'description' => ['string', 'max:255'],
            'is_over' => ['required', 'string', 'max:1'],
            'status' => ['required', 'string', 'max:1'],
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

    public function getProducts(Request $request)
    {
        $products = Products::all()->toArray();

        for ($i = 0; $i < count($products); $i++)
        {

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

        return new JsonResponse(response()->json($products), 200);
    }

    public function create(Request $request)
    {
        //$this->validateFields($request->all())->validate();

        if (Articles::where('art', $request->articul)->exists()) {
            return new JsonResponse(response()->json('article is exists'), 200);
        }

        Articles::create(['art' => $request->articul]);

        $art_id = DB::table('articles')->select('id')->where('art', $request->articul)->value('id');
    
        $product_id = Products::create([
            'price' => $request->price,
            'art_id' => $art_id,
            'is_over' => 0,
            'status' => 0,
            'unit_id' => $request->units
        ])->id;

        ProductDescription::create([
            'name' => $request->name,
            'description' => $request->description,
            'product_id' => $product_id
        ]);

        DB::table('category_to_products')->insert([
            'product_id' => $product_id,
            'category_id' => $request->category
        ]);

        return new JsonResponse(response()->json($products), 200);
    }

    public function update(Request $request)
    {
        //$this->validateFields($request->all())->validate();
        $product_id = $request->id;

        if (Articles::where('art', $request->articul)->exists()) {
            return new JsonResponse(response()->json('article is exists'), 200);
        }
        
        Articles::where(
            'id', Products::where(
                'id', $request->id
            )
            ->select('art_id')
        )
        ->select('art')
        ->update([
            'art' => $request->articul
        ]);

        Products::where('id', $request->id)
        ->update([
            'price' => $request->price,
            'status' => $request->status,
            'unit_id' => $request->units
        ])->id;
        
        ProductDescription::where('product_id', $request->id)
        ->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);
        
        DB::table('category_to_products')
        ->where('product_id', $request->id)
        ->update([
            'category_id' => $request->category
        ]);
        
        return new JsonResponse(response()->json($products), 200);
    }

    public function delete(Request $request)
    {
        
    }
}