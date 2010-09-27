<?php

########################################################################
# Extension Manager/Repository config file for ext "phpdisplay".
#
# Auto generated 27-09-2010 15:11
#
# Manual updates:
# Only the data in the array - everything else is removed by next
# writing. "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Plain PHP based Data Display (Data Consumer) - Tesseract project',
	'description' => 'Use Plain PHP templates to display any kind of data returned by a Data Provider. More info on http://www.typo3-tesseract.com',
	'category' => 'fe',
	'author' => 'Fabien Udriot',
	'author_email' => 'fabien.udriot@ecodev.ch',
	'shy' => '',
	'dependencies' => 'tesseract',
	'conflicts' => '',
	'priority' => '',
	'module' => '',
	'state' => 'stable',
	'internal' => '',
	'uploadfolder' => 0,
	'createDirs' => '',
	'modify_tables' => '',
	'clearCacheOnLoad' => 0,
	'lockType' => '',
	'author_company' => '',
	'version' => '1.0.0',
	'constraints' => array(
		'depends' => array(
			'typo3' => '4.3.0-0.0.0',
			'tesseract' => '1.0.0-0.0.0',
		),
		'conflicts' => array(
		),
		'suggests' => array(
		),
	),
	'_md5_values_when_last_written' => 'a:16:{s:9:"ChangeLog";s:4:"7f63";s:10:"README.txt";s:4:"b948";s:23:"class.tx_phpdisplay.php";s:4:"4363";s:32:"class.tx_phpdisplay_template.php";s:4:"cb80";s:16:"ext_autoload.php";s:4:"cb29";s:12:"ext_icon.gif";s:4:"9530";s:12:"ext_icon.png";s:4:"55ad";s:17:"ext_localconf.php";s:4:"fa6b";s:14:"ext_tables.php";s:4:"ad1b";s:14:"ext_tables.sql";s:4:"b2b4";s:44:"Configuration/TCA/tx_phpdisplay_displays.php";s:4:"dd82";s:43:"Resources/Private/Language/locallang_db.xml";s:4:"683d";s:50:"Resources/Public/images/tx_phpdisplay_displays.png";s:4:"55ad";s:14:"doc/manual.pdf";s:4:"aa8d";s:14:"doc/manual.sxw";s:4:"9740";s:17:"samples/dummy.php";s:4:"c236";}',
	'suggests' => array(
	),
);

?>