<?php

namespace App\Helper;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Illuminate\Http\Request as Req;

class Helper
{

    public static function GetApi($url)
    {
        $client = new \GuzzleHttp\Client();
        $request = $client->get($url);
        $response = $request->getBody();
        return $response;
    }


    public static function PostApi($url, $body, $contentType) {
        $client = new \GuzzleHttp\Client();
        $request = $client->request('POST', $url, [
            'headers' => [
                'Content-Type' => $contentType,
                'Accept' => 'application/json',
            ],
            'form_params' => $body
            //, 'debug' => fopen('php://stderr', 'w'),
        ]);
        $response = $request->getBody();
        return $response;
    }

    public static function PatchApi($url, $body, $contentType) {
        $client = new \GuzzleHttp\Client();
        $res = $client->request('PATCH', $url, [
            'headers' => [
                'Content-Type' => $contentType,
                'Accept' => 'application/json',
            ],
            'form_params' => $body
            //, 'debug' => fopen('php://stderr', 'w'),
        ]);
        return $res->getBody();
    }

    public static function PutApi($url, $body, $contentType) {
        $client = new \GuzzleHttp\Client();
        $res = $client->request('PUT', $url, [
            'headers' => [
                'Content-Type' => $contentType,
                'Accept' => 'application/json',
            ],
            'form_params' => $body
            //, 'debug' => fopen('php://stderr', 'w'),
        ]);
        return $res->getBody();
    }

    public static function DeleteApi($url) {
        $client = new \GuzzleHttp\Client();
        $res = $client->request('DELETE', $url);
        return $res->getBody();
    }
}
