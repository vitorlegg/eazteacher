
$('#login').on('submit',(e)=>{
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/login',
        data: {
          email:$(`#${e.currentTarget.id} input[name=email]`).val(),
          password:$(`#${e.currentTarget.id} input[name=password]`).val(),
        },
        success: (response) => {
          if (response.result == 'redirect') {
            //redirecting to main page from here.
            window.location.replace(response.url);
          }if (response.result == 'errado') {
            $(".invalid-feedback").css("display", "block");
          } 
        },
        error: (result) =>{
            alert("Data not found");
        }
      });
}); 