$('#logout').on('click',(e)=>{
    axios.post('/logout');
  });

  $('#updateProfile').on('submit',(e)=>{
    e.preventDefault();
    var formData = new FormData(document.getElementById("updateProfile"));
    $.ajax({
        type: "post",
        url: '/updateProfile',
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => {
          if (response.result == 'redirect') {
            //redirecting to main page from here.
            window.location.replace(response.url);
          }
        },
        error: (result) =>{
            alert("Data not found");
        }
      });
  }); 

  $('.nota').on('click',(e)=>{
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/gradeActivity',
        data: {
          id:$(e.currentTarget).data('id'),
          nota:$('input[name=notas]').val()
        },
        success: (response) => {
          if (response.result == 'redirect') {
            //redirecting to main page from here.
            window.location.replace(response.url);
          }
        },
        error: (result) =>{
            alert("Data not found");
        }
      });
  }); 
  
