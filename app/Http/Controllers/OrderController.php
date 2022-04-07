<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Orders;
use App\Models\Products;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Post;
use Illuminate\Support\Arr;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function getOrders()
    {
        $orders = Orders::all()->toArray();
        $products = Products::all()->toArray();

        $data['orders'] = DB::table('orders')->get();
        $data['products'] = DB::table('order_products')->get();
        
        for ($i = 0; $i < count($products); $i++) 
        {
            $orders[$i] = Arr::add($orders[$i], 'payment_type', DB::table('payment_types')
                ->select('name')
                ->where('id', $orders[$i]['payment_type_id'])
                ->value('name')
            );

            $orders[$i] = Arr::add($orders[$i], 'employee', DB::table('employees')
                ->select('name')
                ->where('id', $orders[$i]['employee_id'])
                ->value('name')
            );

            $orders[$i] = Arr::add($orders[$i], 'customer', DB::table('customers')
                ->select('name')
                ->where('id', $orders[$i]['customer_id'])
                ->value('name')
            );

            $orders[$i] = Arr::add($orders[$i], 'status', DB::table('order_status')
                ->select('name')
                ->where('id', $orders[$i]['status_id'])
                ->value('name')
            );

            $orders[$i] = Arr::add($orders[$i], 'mark', DB::table('marks')
                ->select('name')
                ->where('id', DB::table('order_marks')
                    ->select('mark_id')
                    ->where('order_id', $orders[$i]['id'])
                    ->value('mark_id'))
                    ->value('name')
            );
/*
            $orders[$i] = Arr::add($orders[$i], 'products', DB::table('products')
            ->select
            DB::table('order_products')
            ->select('product_id')
            ->where('order_id', $orders[$i]['id'])
            ->value('product_id')
        );*/
        }

        foreach($data['orders'] as $order) {
            $data['order_status'][] = DB::table('order_status')->where('id', $order->status_id)->get();
            $data['orders_marks'][] = DB::table('order_marks')->where('order_id', $order->id)->get();
            $data['employees'][] = DB::table('employees')->where('id', $order->employee_id)->get();
        }
        
        foreach ($data['products'] as $product) {
            $data['product_info'][] = DB::table('products')->where('id', $product->product_id)->get();
            $data['product_description'][] = DB::table('product_descriptions')->where('product_id', $product->product_id)->get();
        }
/*
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
            );*/
            return new JsonResponse(response()->json($orders), 200);
    }
}
