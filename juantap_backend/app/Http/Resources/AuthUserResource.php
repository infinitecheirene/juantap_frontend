<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'display_name' => $this->display_name ?? $this->name,
            'is_admin' => (bool) $this->is_admin,

            // Only include profile if needed
            'profile' => [
                'bio' => $this->profile->bio ?? '',
                'avatar_url' => $this->profile_image
                    ? asset($this->profile_image)
                    : asset('avatars/default.png'),
            ],
        ];
    }
}
