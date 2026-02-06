$(function (){

	
	$('#request_search').on('keyup', function (){

			
			var search = $('#request_search').val();



			$.post("user_search_request.php", {


				search: search

			}, 


					function(data) {


						$("#result").html(data);

						console.log('something is happening');
					}

			)





	});

	

	$('#patient_search').on("keyup", function(){

		var search = $('#patient_search').val();



		if(search == "") {


				console.log('get original table')


		} else {


				$.post('patient_search.php', {


					search: search


				}, function(data){


					$('#result').html(data);
				})


		}


		
	})

});