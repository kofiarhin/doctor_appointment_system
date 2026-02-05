<?php

session_start();

require_once __DIR__ . '/../functions/functions.php';

define('application', realpath(__DIR__ . '/..'));

$paths = array(
    application,
    application . DIRECTORY_SEPARATOR . 'classes',
    get_include_path()
);

set_include_path(implode(PATH_SEPARATOR, $paths));

spl_autoload_register(function ($class) {
    $classFile = $class . '.php';
    $lowerClassFile = strtolower($class) . '.php';

    $resolvedClass = stream_resolve_include_path($classFile);
    if ($resolvedClass !== false) {
        require_once $resolvedClass;
        return;
    }

    $resolvedLowerClass = stream_resolve_include_path($lowerClassFile);
    if ($resolvedLowerClass !== false) {
        require_once $resolvedLowerClass;
        return;
    }

    throw new RuntimeException("Unable to load class file for {$class}");
});

$GLOBALS['config'] = array(

    'mysql' => array(

        'host' => '127.0.0.1',
        'dbname' => 'test',
        'user' => 'root',
        'password' => 'root'
    ),


    'session' => array(

        'session_name' => 'user',
        'token_name' => 'token'

    ),


    'cookie' => array(

        'cookie_name' => 'hash',
        'cookie_expiry' => 604800

    )

);
