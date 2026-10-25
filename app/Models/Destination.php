<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'slug',
        'description',
        'content',
        'price',
        'discount_price',
        'location',
        'opening_time',
        'closing_time',
        'rating',
        'is_published',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(DestinationImage::class);
    }
}
