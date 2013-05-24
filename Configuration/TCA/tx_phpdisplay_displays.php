<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$TCA['tx_phpdisplay_displays'] = array(
	'ctrl' => $GLOBALS['TCA']['tx_phpdisplay_displays']['ctrl'],
	'interface' => array(
		'showRecordFieldList' => 'hidden,title,description'
	),
	'feInterface' => $GLOBALS['TCA']['tx_phpdisplay_displays']['feInterface'],
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
			'label' => 'LLL:EXT:phpdisplay/Resources/Private/Language/locallang_db.xml:tx_phpdisplay_displays.title',
			'config' => array(
				'type' => 'input',
				'size' => '30',
				'eval' => 'required,trim',
			)
		),
		'description' => array(
			'exclude' => 0,
			'label' => 'LLL:EXT:phpdisplay/Resources/Private/Language/locallang_db.xml:tx_phpdisplay_displays.description',
			'config' => array(
				'type' => 'text',
				'cols' => '40',
				'rows' => '4',
			)
		),
		'template' => array(
			'exclude' => 0,
			'label' => 'LLL:EXT:phpdisplay/Resources/Private/Language/locallang_db.xml:tx_phpdisplay_displays.template',
			'config' => array(
				'type' => 'input',
				'size' => '30',
				'eval' => 'trim',
				'default' => 'EXT:phpdisplay/Samples/Simple.php',
				'wizards' => Array(
					'_PADDING' => 2,
					'link' => Array(
						'type' => 'popup',
						'title' => 'Link',
						'icon' => 'link_popup.gif',
						'script' => 'browse_links.php?mode=wizard',
						'JSopenParams' => 'height=600,width=700,status=0,menubar=0,scrollbars=1'
					)
				)
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

t3lib_extMgm::addToAllTCAtypes("tx_phpdisplay_displays","--palette--;LLL:EXT:phpdisplay/Resources/Private/Language/locallang_db.xml:tx_phpdisplay_displays.debug;10","","after:description");
t3lib_extMgm::addToAllTCAtypes("tx_phpdisplay_displays","--palette--;LLL:EXT:phpdisplay/Resources/Private/Language/locallang_db.xml:tx_phpdisplay_displays.pagebrowser;20","","after:description");

?>