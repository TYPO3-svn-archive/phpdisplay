<?php
if (!defined ('TYPO3_MODE')) {
 	die ('Access denied.');
}
t3lib_extMgm::addUserTSConfig('
	options.saveDocNew.tx_phpdisplay_displays=1
');

/*
 * Hook for loading Javascript and CSS in the backend
 */
#if (TYPO3_MODE == 'BE')	{
#	require_once(t3lib_extMgm::extPath('phpdisplay').'hook/user_addBackendLibrary.php');
#}
#$TYPO3_CONF_VARS['SC_OPTIONS']['typo3/template.php']['preStartPageHook'][] = 'user_addBackendLibrary';

// Register as Data Consumer service
// Note that the subtype corresponds to the name of the database table
t3lib_extMgm::addService($_EXTKEY,  'dataconsumer' /* sv type */,  'tx_phpdisplay_dataconsumer' /* sv key */,
	array(

		'title' => 'Data Display Engine',
		'description' => 'Generic Data Consumer for recordset-type data structures',

		'subtype' => 'tx_phpdisplay_displays',

		'available' => TRUE,
		'priority' => 50,
		'quality' => 50,

		'os' => '',
		'exec' => '',

		'classFile' => t3lib_extMgm::extPath($_EXTKEY, 'class.tx_phpdisplay.php'),
		'className' => 'tx_phpdisplay',
	)
);
?>
