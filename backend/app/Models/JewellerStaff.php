<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JewellerStaff extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'jeweller_id',
        'name',
        'phone',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
