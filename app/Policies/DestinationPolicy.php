<?php

namespace App\Policies;

use App\Models\Destination;
use App\Models\User;

class DestinationPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'business_owner'], true);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Destination $destination): bool
    {
        return $user->role === 'admin'
            || ($user->role === 'business_owner' && $destination->user_id === $user->id);
    }

    public function delete(User $user, Destination $destination): bool
    {
        return $this->update($user, $destination);
    }
}
