<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Products;
use App\Models\Articles;
use App\Models\ProductDescription;
use App\Models\CategoryToProducts;
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
            'categories' => DB::table('categories')->select('id', 'name', 'parent_id')->get()->toArray(),
            'units' => DB::table('units')->select('id', 'name')->get()->toArray()
        ]), 200);
    }

    public function getProducts(Request $request)
    {
        /*
        $products = Products::paginate(2)->toArray();

        for ($i = 0; $i < count($products['data']); $i++)
        {
            $products['data'][$i] = Arr::add($products['data'][$i], 'category_id', DB::table('categories')
                ->select('id')
                ->where('id', DB::table('category_to_products')
                ->select('category_id')
                ->where('product_id', $products['data'][$i]['id'])
                ->value('id'))
                ->value('product_id')
            );
            
            $products['data'][$i] = Arr::add($products['data'][$i], 'category', DB::table('categories')
                ->select('name')
                ->where('id', DB::table('category_to_products')
                ->select('category_id')
                ->where('product_id', $products['data'][$i]['id'])
                ->value('id'))
                ->value('product_id')
            );

            $products['data'][$i] = Arr::add($products['data'][$i], 'art', DB::table('articles')
                ->select('art')
                ->where('id', DB::table('products')
                ->select('art_id')
                ->where('id', $products['data'][$i]['id'])
                ->value('art_id'))
                ->value('art')
            );
            
            $products['data'][$i] = Arr::add($products['data'][$i], 'name', DB::table('product_descriptions')
                ->select('name')
                ->where('product_id', $products['data'][$i]['id'])
                ->value('name')
            );

            $products['data'][$i] = Arr::add($products['data'][$i], 'description', DB::table('product_descriptions')
                ->select('description')
                ->where('product_id', DB::table('products')
                ->select('id')
                ->where('id', $products['data'][$i]['id'])
                ->value('id'))
                ->value('description')
            );

            $products['data'][$i] = Arr::add($products['data'][$i], 'unit', DB::table('units')
                ->select('name')
                ->where('id', $products['data'][$i]['unit_id'])
                ->value('name')
            );
        }*/
        $category_id = $request->category_id;
        $products_id = CategoryToProducts::where('category_id', $category_id)->select('product_id')->get()->toArray();
        
        for ($i = 0; $i < count ($products_id); $i++)
        {
            $products[] = Products::where('id', $products_id[$i])->get()->toArray();

            $products[$i][0] = Arr::add($products[$i][0], 'name', DB::table('product_descriptions')
                ->select('name')
                ->where('product_id',  $products_id[$i])
                ->value('name')
            );

            $products[$i][0] = Arr::add($products[$i][0], 'art', DB::table('articles')
                ->select('art')
                ->where('id', DB::table('products')
                ->select('art_id')
                ->where('id',  $products_id[$i])
                ->value('art_id'))
                ->value('art')
            );

            $products[$i][0] = Arr::add($products[$i][0], 'category_id', DB::table('categories')
                ->select('id')
                ->where('id', DB::table('category_to_products')
                ->select('category_id')
                ->where('product_id',  $products_id[$i])
                ->value('id'))
                ->value('product_id')
            );

            $products[$i][0] = Arr::add($products[$i][0], 'category', DB::table('categories')
                ->select('name')
                ->where('id', DB::table('category_to_products')
                ->select('category_id')
                ->where('product_id',  $products_id[$i])
                ->value('id'))
                ->value('product_id')
            );

            $products[$i][0] = Arr::add($products[$i][0], 'unit', DB::table('units')
                ->select('name')
                ->where('id',  $products[$i][0]['unit_id'])
                ->value('name')
            );
 
            $products[$i][0] = Arr::add($products[$i][0], 'description', DB::table('product_descriptions')
                ->select('description')
                ->where('product_id', $products_id[$i])
                ->value('description')
            );

            $products[$i][0] = Arr::add($products[$i][0], 'quantity', DB::table('product_quantity')
                ->select('quantity')
                ->where('product_id', $products_id[$i])
                ->value('description')
            );

            $products[$i][0] = Arr::add($products[$i][0], 'products', DB::table('product_descriptions')
                ->select('product_id', 'name')
                ->where('product_id', DB::table('product_to_product')
                ->select('relation_product_id')
                ->where('product_id', $products_id[$i])
                ->value('relation_product_id'))
                ->get()->toArray()
            );

            $products[$i][0] = Arr::add($products[$i][0], 'nutritional value', DB::table('product_nutritional_value')
                ->select('calories', 'squirrels', 'fats', 'carbohydrates')
                ->where('product_id', $products_id[$i])
                ->get()->toArray()
            );
        }

        $products = Arr::collapse($products);

        $products = $this->productsSort($products, 'price', 'desc');
        
        return response()->json(['products' => $products, 'total' => count($products)]);
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
            'unit_id' => $request->unit_id,
            'created_at' => date("Y-m-d H:i:s"),
        ])->id;

        ProductDescription::create([
            'name' => $request->name,
            'description' => $request->description,
            'product_id' => $product_id,
            'created_at' => date("Y-m-d H:i:s"),
        ]);

        DB::table('category_to_products')->insert([
            'product_id' => $product_id,
            'category_id' => $request->category_id,
            'created_at' => date("Y-m-d H:i:s"),
        ]);

        return $this->getProducts();
    }

    public function update(Request $request)
    {
        $this->validateFields($request->all())->validate();

        Articles::where('id', Products::where('id', $request->id)
            ->value('art_id')
        )
        ->update([
            'art' => $request->art,
            'updated_at' => date("Y-m-d H:i:s"),
        ]);

        Products::where('id', $request->id)
        ->update([
            'price' => $request->price,
            'unit_id' => $request->unit_id,
            'updated_at' => date("Y-m-d H:i:s"),
        ]);
        
        ProductDescription::where('product_id', $request->id)
        ->update([
            'name' => $request->name,
            'description' => $request->description,
            'updated_at' => date("Y-m-d H:i:s"),
        ]);
        
        DB::table('category_to_products')
        ->where('product_id', $request->id)
        ->update([
            'category_id' => $request->category_id,
            'updated_at' => date("Y-m-d H:i:s"),
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

    public function productsSort ($products, $sortField = '', $sortBy = '')
    {
        $products = collect($products);

        if ($sortBy = 'asc') 
        {
           $sorted = $products->sortBy($sortField);
           $sorted->values()->all();
        } 
        else 
        {
            $sorted = $products->sortByDesc($sortField);
            $sorted->values()->all();
        }

        $sorted = $sorted->reverse()->values();

        return $sorted;
    }
}