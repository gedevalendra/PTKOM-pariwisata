<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DestinationImage extends Model
{
    use HasUuids;

    protected $fillable = ['destination_id', 'image_url', 'is_primary'];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    /**
     * Delete the image file from the public disk when it is stored locally.
     */
    public function deleteStoredFile(): void
    {
        if (Str::startsWith($this->image_url, '/storage/')) {
            Storage::disk('public')->delete(Str::replaceFirst('/storage/', '', $this->image_url));
        }
    }
}
