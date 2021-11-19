var activitiesId = undefined;

$('.act').on('click',(e)=>{
  e.preventDefault();
  activitiesId = $(e.currentTarget).data('id')
}); 

$('.deleteActivity').on('click',(e)=>{
    $.ajax({
        type: "post",
        url: '/deleteActivity',
        data: {
            id: $(e.currentTarget).data('id')
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

$('a[name=download]').on('click',(e)=>{
  window.open($(e.currentTarget).data('url'));
});

$('#sendActivity').on('submit',(e)=>{
  e.preventDefault();
  var formData = new FormData(document.getElementById("sendActivity"));
  formData.append('id', activitiesId);
  $.ajax({
      type: "post",
      url: '/sendActivity',
      data: formData,
      processData: false,
      contentType: false,
      /*
      {

      },*/
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
