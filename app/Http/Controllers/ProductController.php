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
            'price' => ['required', 'string', 'max:255'],
            'is_over' => ['required', 'string', 'max:1'],
            'status' => ['required', 'string', 'max:1'],
        ]);
    }

    public function authCheck()
    {
        return response()->json(['auth' => Auth::check()]);
    }

    public function getProducts(Request $request)
    {
        $data['products'] = Products::all()->toArray();
        $product_descriptions = ProductDescription::all()->toArray(); 
        $articles = Articles::all()->toArray();

        for ($i = 0; $i < count($data['products']); $i++)
        {
            if ($data['products'][$i]['art_id'] == $articles[$i]['id']) {
                $data['products'][$i] = Arr::add($data['products'][$i], 'art', $articles[$i]['art']);
            }

            if ($data['products'][$i]['id'] == $product_descriptions[$i]['product_id']) {
                $data['products'][$i] = Arr::add($data['products'][$i], 'name', $product_descriptions[$i]['name']);
                $data['products'][$i] = Arr::add($data['products'][$i], 'description', $product_descriptions[$i]['description']);
            }

            $data['products'][$i] = Arr::add($data['products'][$i], 'unit', DB::table('units')->select('name')->where('id',$data['products'][$i]['unit_id'])->value('name'));
        }

        return view('products.index', $data);
    }

    public function create(Request $request)
    {
        $data['categories'] = DB::table('categories')
            ->select('id', 'name')
            ->get();
        
        $data['units'] = DB::table('units')
            ->select('id','name')
            ->get();

        if (!empty($request->input('articul'))){
            Articles::create(['art' => $request->input('articul')]);
        }

        $id = DB::table('articles')->select('id')->where('art', $request->input('articul'))->value('id');
    
        if (!empty($request->input('price'))){

            $productId = Products::create([
                'price' => $request->input('price'),
                'art_id' => $id,
                'is_over' => 0,
                'status' => 1,
                'unit_id' => $request->units
            ])->id;
        }
        
        if (!empty($request->input('name'))){
            $description = $request->input('description');

            ProductDescription::create([
                'name' => $request->input('name'),
                'description' => $description,
                'product_id' => $productId
            ]);

            DB::table('category_to_products')->insert([
                'product_id' => $productId,
                'category_id' => $request->category
            ]);
        }

        return view('products.form', $data);
    }

    public function update(Request $request)
    {
        /*
        $data['categories'] = DB::table('categories')
            ->select('name')->get();

        if (!empty($request->input('articul'))){
            Articles::create(['art' => $request->input('articul')]);
        }

        $id = DB::table('articles')->select('id')->where('art', $request->input('articul'))->value('id');
    
        if (!empty($request->input('price'))){

            $productId = Products::create([
                'price' => $request->input('price'),
                'art_id' => $id,
                'is_over' => 0,
                'status' => 1,
            ])->id;
        }
        
        if (!empty($request->input('name'))){
            $description = $request->input('description');

            ProductDescription::create([
                'name' => $request->input('name'),
                'description' => $description,
                'product_id' => $productId,
            ]);
        }*/

        return view('products.formUpd', $data);
    }


}