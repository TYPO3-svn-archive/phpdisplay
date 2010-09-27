<?php
/* 
 * Register necessary class names with autoloader
 *
 * $Id$
 */
$extensionPath = t3lib_extMgm::extPath('phpdisplay');
return array(
	'tx_phpdisplay' => $extensionPath . 'class.tx_phpdisplay.php',
	'tx_phpdisplay_template' => $extensionPath . 'class.tx_phpdisplay_template.php',
);
?>
