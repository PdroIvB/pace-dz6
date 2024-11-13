<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateColumnRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|min:3',
            'workspace_id' => 'required|exists:workspaces,id',
            'owner_id' => 'required|exists:users,id'
        ];
    }

    public function attributes (): array
    {
        return [
            'name' => 'título da lista',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'owner_id' => $this->user()->id,
        ]);
    }
}