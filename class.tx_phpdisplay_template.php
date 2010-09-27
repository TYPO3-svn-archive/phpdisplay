<?php
/***************************************************************
*  Copyright notice
*
*  Copyright: http://www.massassi.com/php/articles/template_engines/
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	 See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/

/**
 * Very basic PHP template engine
 *
 * @package		TYPO3
 * @subpackage	tx_phpdisplay
 *
 * $Id$
 */

class tx_phpdisplay_template {
	private $vars = array(); /// Holds all the template variables

	/**
	 * Constructor
	 *
	 * @param $file string the file name you want to load
	 */
	function __construct($file = null){
		$this->file = $file;
	}

	/**
	 * Set a template variable.
	 */
	function set($name, $value){
		$this->vars[$name] = $value;
	}

	/**
	 * Open, parse, and return the template file.
	 *
	 * @param $file string the template file name
	 */
	function fetch($file = null){
		if(! $file) {
			$file = $this->file;
		}
		
		extract($this->vars); // Extract the vars to local namespace
		ob_start(); // Start output buffering
		include ($file); // Include the file
		$contents = ob_get_contents(); // Get the contents of the buffer
		ob_end_clean(); // End buffering and discard
		return $contents; // Return the contents
	}
}

?>