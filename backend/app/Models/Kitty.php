<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kitty extends Model
{
    use HasFactory;

    protected $fillable = [
        'kitty_name',
        'kitty_type',
        'start_date',
        'end_date',
        'target_amount',
        'collected_amount',
        'status',
        'description',
        'created_by',
    ];
}
