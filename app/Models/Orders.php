<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'payment_type_id',
        'employee_id',
        'address',
        'customer_id',
        'comment',
        'status_id'
    ];
}
