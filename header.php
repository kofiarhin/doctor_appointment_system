<?php 

require_once "core/init.php";

$user = new User;

?>

<!DOCTYPE html>
<html lang="en">


<head>
	<meta charset="UTF-8">
	<title>Bruce Care</title>

	<!--====  font awesome=======-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	

	<!--==== custom style sheet=======-->
	<link rel="stylesheet" href="css/main.css">


	<!--====  jquery=======-->
	<script src='js/jquery.js'></script>

	<!--==== custom js=======-->
	<script src='js/main.js'></script>
</head>



<body>

	<header class="main-header">

		<div class="container">

			<h1 class="logo"><a href="index.php">Bruce<span>Care</span></a></h1>

			<nav>


				


				<?php 



				if($user->logged_in()) {

					$role = $user->data()->role;



					switch ($role) {

						case 'patient':
						$profile_path = "patient_profile.php";
						$home_path = "patient_dashboard.php";
						$text = "patient dashboard";
						break;
						case 'doctor':
						$profile_path = "doctor_profile.php";
						$home_path = "doctor_dashboard.php";
						$text = "doctor dashboard";
						break;
						default:
						$profile_path = "admin_profile.php";
						$home_path = "admin_dashboard.php";
						$text ="Admin Dashboard";
						break;
					}



					?>

					<a href="<?php echo $home_path; ?>"><?php echo $text; ?></a>
					<a href="<?php echo $profile_path; ?>">Profile</a>
					<a href="logout.php">Logout</a>

					<?php 						} else {


						?>
						
						<a href="login.php">Login</a>
						<a href="register.php">Register</a>
						<a href="pricing.php">Pricing</a>
						<a href="about.php">About Us</a>


						<?php 
					}

					?>
					
					
					<a href="contact.php">Contact</a>
				</nav>

			</div>
		</header>

