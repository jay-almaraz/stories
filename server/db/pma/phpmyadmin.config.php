<?php

// Set timeout to 24 hours
$sessionDuration = 60 * 60 * 24;
ini_set('session.gc_maxlifetime', $sessionDuration);
$cfg['LoginCookieValidity'] = $sessionDuration;
// $cfg['ThemeDefault'] = 'pmahomme';
