<?php

	// Collect POST data from form
	$from = stripslashes($_POST['from']);
	$email_to = stripslashes($_POST['email_to']);
	$vtitle = stripslashes($_POST['vtitle']);
	$vid = stripslashes($_POST['vid']);
	$email_from = 'films@foglifter.com';
	
	$subject = $from . ', Has shared a video with you!';

	// Define email variables
	$message = $from. ', Has shared a FogLifter Films video with you!' . "\r\n\r\n" . $vtitle . "\r\n" . 'http://mathewlyles.com/work/foglifter/ipadapp2/share.html?vid='.$vid. "\r\n\r\n" . 'www.foglifter.com';
	
	
	
	$headers = 'From: '.$email_from."\r\n".
	'Reply-To: '.$email_from."\r\n" .
	'X-Mailer: PHP/' . phpversion();

	if( mail($email_to, $subject, $message, $headers) ) {
		return true;
	} else {
		return false;
	}


?>