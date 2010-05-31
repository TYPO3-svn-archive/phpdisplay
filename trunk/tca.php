<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$TCA['tx_phpdisplay_displays'] = array(
	'ctrl' => $TCA['tx_phpdisplay_displays']['ctrl'],
	'interface' => array(
		'showRecordFieldList' => 'hidden,title,description,mappings'
	),
	'feInterface' => $TCA['tx_phpdisplay_displays']['feInterface'],
	'columns' => array(
		'hidden' => array(
			'exclude' => 1,
			'label'   => 'LLL:EXT:lang/locallang_general.xml:LGL.hidden',
			'config'  => array(
				'type'    => 'check',
				'default' => '0'
			)
		),
		'title' => array(
			'exclude' => 0,
			'label' => 'LLL:EXT:phpdisplay/locallang_db.xml:tx_phpdisplay_displays.title',
			'config' => array(
				'type' => 'input',
				'size' => '30',
				'eval' => 'required,trim',
			)
		),
		'description' => array(
			'exclude' => 0,
			'label' => 'LLL:EXT:phpdisplay/locallang_db.xml:tx_phpdisplay_displays.description',
			'config' => array(
				'type' => 'text',
				'cols' => '40',
				'rows' => '4',
			)
		),
		'template' => array(
			'exclude' => 0,
			'label' => 'LLL:EXT:phpdisplay/locallang_db.xml:tx_phpdisplay_displays.template',
			'config' => array(
				'type' => 'input',
				'default' => 'fileadmin/templates/plugins/tesseract/list_of_news.php',
				'size' => '30',
				'eval' => 'trim',
				'default' => 'FILE:typo3conf/ext/phpdisplay/samples/dummy.php'
 			)
		),
	),
	'types' => array(
		'0' => array('showitem' => 'hidden;;1;;1-1-1, title;;;;2-2-2, template, description')
	),
	'palettes' => array(
		'1' => array('showitem' => '')
	)
);

t3lib_extMgm::addToAllTCAtypes("tx_phpdisplay_displays","--palette--;LLL:EXT:phpdisplay/locallang_db.xml:tx_phpdisplay_displays.debug;10","","after:description");
t3lib_extMgm::addToAllTCAtypes("tx_phpdisplay_displays","--palette--;LLL:EXT:phpdisplay/locallang_db.xml:tx_phpdisplay_displays.pagebrowser;20","","after:description");

?>