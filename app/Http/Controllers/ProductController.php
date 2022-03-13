<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Products;
use App\Models\Articles;
use App\Post;

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

    public function all()
    {
        $products = DB::table('products')->get();
        $products_desc = DB::table('product_description')->get();
        $units = DB::table('units')->get();
    }

    public function create(Request $request)
    {
        //Articles::create(['art' => '123321']);
        
        Products::create([
            'price' => 123,
            'art_id' => DB::table('articles')->select('id')->where('art', '123321')->get(),
            'is_over' => 0,
            'status' => 1,
        ]);
    }


}