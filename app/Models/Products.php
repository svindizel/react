<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;


    protected $fillable = [
        'price',
        'art_id',
        'is_over',
        'status',
        'unit_id'
    ];

}
