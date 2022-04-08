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
        /**
         * ДОДЕЛАТЬ category_id
         */
        $category_id = 1;
        $products = ProductDescription::where('category_to_products.category_id', '=', $category_id)
            ->join(
                'category_to_products', 
                'category_to_products.product_id', 
                '=', 
                'product_descriptions.product_id'
            )
            ->join(
                'products', 
                'products.id', 
                '=', 
                'product_descriptions.product_id'
            )
            ->join(
                'articles', 
                'articles.id', 
                '=', 
                'products.art_id'
            )
            ->join(
                'categories', 
                'categories.id', 
                '=', 
                'category_to_products.category_id'
            )
            ->join(
                'units', 
                'units.id', 
                '=', 
                'products.unit_id'
            )
            ->join(
                'product_quantity',
                'product_quantity.product_id',
                '=',
                'products.id'
            )
            ->select(
                'product_descriptions.name', 
                'products.*', 'articles.art', 
                'category_to_products.category_id', 
                'categories.name as category', 
                'units.name as unit', 
                'product_descriptions.description',
                'product_quantity.quantity',
            )
            ->get()
            ->toArray();
            
            for ($i = 0; $i < count($products); $i++)
            {
                $products[$i] = Arr::add($products[$i], 'products', DB::table('product_descriptions')
                    ->select('product_id', 'name')
                    ->where('product_id', DB::table('product_to_product')
                    ->select('relation_product_id')
                    ->where('product_id', $products[$i]['id'])
                    ->value('relation_product_id'))
                    ->get()->toArray()
                );

                $products[$i] = Arr::add($products[$i], 'nutritional value', DB::table('product_nutritional_value')
                    ->select('calories', 'squirrels', 'fats', 'carbohydrates')
                    ->where('product_id', $products[$i]['id'])
                    ->get()->toArray()
                );
            }

        $products = $this->productsSort($products, 'id', 'asc');
        
        return response()->json(['products' => $products, 'total' => count($products)]);
    }

    public function create(Request $request)
    {
        /**
         * ПОЛУЧАТЬ  quantity, relation_product_id calories, squirrels, fats, carbohydrates
         */
        $this->validateFields($request->all())->validate();

        if (Articles::where('art', $request->art)->exists()) {
            return new JsonResponse(response()->json('Article is exists'), 422);
        }

        Articles::create(['art' => $request->art]);

        $art_id = DB::table('articles')->select('id')->where('art', $request->art)->value('id');
        /**
         * Цена, артикул, стоп-лист
         */
        $product_id = Products::create([
            'price' => $request->price,
            'art_id' => $art_id,
            'is_over' => 0,
            'status' => 0,
            'unit_id' => $request->unit_id,
            'created_at' => date("Y-m-d H:i:s"),
        ])->id;
        /**
         * Описание, название
         */
        ProductDescription::create([
            'name' => $request->name,
            'description' => $request->description,
            'product_id' => $product_id,
            'created_at' => date("Y-m-d H:i:s"),
        ]);
        /**
         * Категория
         */
        DB::table('category_to_products')->insert([
            'product_id' => $product_id,
            'category_id' => $request->category_id,
            'created_at' => date("Y-m-d H:i:s"),
        ]);
        /**
         * КБЖУ
         */
        DB::table('product_nutritional_value')->insert([
            'product_id' => $product_id,
            'calories' => 123,
            'squirrels' => 3,
            'fats' => 2,
            'carbohydrates' => 1,
            'created_at' => date("Y-m-d H:i:s"),
        ]);
        /**
         * связи с другими продуктами
         */
        DB::table('product_to_product')->insert([
            'product_id' => $product_id,
            'relation_product_id' => 47,
            'created_at' => date("Y-m-d H:i:s"),
        ]);
        /**
         * количество продукта
         */
        DB::table('product_quantity')->insert([
            'product_id' => $product_id,
            'quantity' => 1000,
            'created_at' => date("Y-m-d H:i:s"),
        ]); 

        return $this->getProducts();
    }

    public function update(Request $request)
    {
        /**
         * ПОЛУЧАТЬ  quantity, relation_product_id calories, squirrels, fats, carbohydrates
         */
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

        /**
         * КБЖУ
        */
        DB::table('product_nutritional_value')->where('product_id', $product_id)
        ->update([
            'calories' => 321,
            'squirrels' => 1,
            'fats' => 3,
            'carbohydrates' => 2,
            'updated_at' => date("Y-m-d H:i:s")
        ]);
        /**
         * связи с другими продуктами
         */
        DB::table('product_to_product')->where('product_id',$product_id)
        ->update([
            'relation_product_id' => 46,
            'updated_at' => date("Y-m-d H:i:s")
        ]);
        /**
         * количество продукта
         */
        DB::table('product_quantity')->where('product_id',$product_id)
        ->update([
            'quantity' => 999,
            'updated_at' => date("Y-m-d H:i:s")
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
           $sorted = $products->sortBy($sortField)->values()->all();
        } 
        elseif ($sortBy = 'desc')
        {
            $sorted = $products->sortByDesc($sortField)->values()->all();
        }

        return $sorted;
    }

    public function search (Request $request)
    {
        /**
         * ПОЛУЧАТЬ category_id И search_field
         */
        $products = ProductDescription::where('product_descriptions.name', 'like', '%кан%')
            ->join(
                'category_to_products', 
                'category_to_products.product_id', 
                '=', 
                'product_descriptions.product_id'
            )
            ->join(
                'products', 
                'products.id', 
                '=', 
                'product_descriptions.product_id'
            )
            ->join(
                'articles', 
                'articles.id', 
                '=', 
                'products.art_id'
            )
            ->join(
                'categories', 
                'categories.id', 
                '=', 
                'category_to_products.category_id'
            )
            ->join(
                'units', 
                'units.id', 
                '=', 
                'products.unit_id'
            )
            ->join(
                'product_quantity',
                'product_quantity.product_id',
                '=',
                'products.id'
            )
            ->select(
                'product_descriptions.name', 
                'products.*', 'articles.art', 
                'category_to_products.category_id', 
                'categories.name as category', 
                'units.name as unit', 
                'product_descriptions.description',
                'product_quantity.quantity',
            )
            ->where('category_to_products.category_id', '=', 1)
            ->get()
            ->toArray();

            for ($i = 0; $i < count($products); $i++)
            {
                $products[$i] = Arr::add($products[$i], 'products', DB::table('product_descriptions')
                    ->select('product_id', 'name')
                    ->where('product_id', DB::table('product_to_product')
                    ->select('relation_product_id')
                    ->where('product_id', $products[$i]['id'])
                    ->value('relation_product_id'))
                    ->get()->toArray()
                );

                $products[$i] = Arr::add($products[$i], 'nutritional value', DB::table('product_nutritional_value')
                    ->select('calories', 'squirrels', 'fats', 'carbohydrates')
                    ->where('product_id', $products[$i]['id'])
                    ->get()->toArray()
                );
            }

        return response()->json(['products' => $products, 'total' => count($products)]);
    }
}