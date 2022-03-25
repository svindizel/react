<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Post;
use Illuminate\Support\Arr;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function getCategories()
    {
        return new JsonResponse(response()->json(
            DB::table('categories')->select('id', 'name')
                ->get()
                ->toArray()
        ), 200);
    }

    public function create(Request $request)
    {
        DB::table('categories')
            ->insert([
                'name' => $request->name,
                'description' => $request->description
        ]);

        $this->getCategories();
    }

    public function update(Request $request)
    {
        DB::table('categories')
            ->where('id', $request->id)
            ->update([
                'name' => $request->name,
                'description' => $request->description
        ]);

        $this->getCategories();
    }

    public function delete(Request $request)
    {
        DB::table('categories')
            ->where('id', $request->id)
            ->delete();

        $this->getCategories();
    }
}
