<?php
if (!defined ('TYPO3_MODE')) {
 	die ('Access denied.');
}
t3lib_extMgm::addUserTSConfig('
	options.saveDocNew.tx_phpdisplay_displays=1
');

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
