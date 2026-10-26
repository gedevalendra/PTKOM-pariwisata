<?php

namespace App\Http\Requests;

class UpdateDestinationRequest extends StoreDestinationRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('destination')) ?? false;
    }
}
