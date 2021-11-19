
var currentId = undefined;

$('a[name=excluir]').on('click',(e)=>{
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/deleteGroup',
        data: $(e.currentTarget).data(),
        success: (response) => {
          if (response.result == 'redirect') {
            //redirecting to main page from here.
            window.location.replace(response.url);
          }
        },
        error:(result) => {
            alert("Data not found");
        }
      });
}); 

$('a[name=unfollow]').on('click',(e)=>{
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/unfollowGroup',
        data: $(e.currentTarget).data(),
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

$('#sendMessage').on('submit',(e)=>{
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/createMessage',
        data: {
            titulo:$(`#${e.currentTarget.id} input[name=name]`).val(),
            mensagem:$(`#${e.currentTarget.id} textarea[name=description]`).val(),
            id: currentId
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

$('#createActivity').on('submit',(e)=>{
  e.preventDefault();
  var formData = new FormData(document.getElementById("createActivity"));
  formData.append('id', currentId);
  console.log(formData)
  $.ajax({
      type: "post",
      url: '/createActivity',
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

$('#showMembers').on('submit',(e)=>{
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/showMembers',
        data:{
            id:currentId
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

$('a[name=unfollow]').on('click',(e)=>{
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/unfollowGroup',
        data: $(e.currentTarget).data(),
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

$('.opt').on('click',(e)=>{
    e.preventDefault();
    currentId = $(e.currentTarget).data('id')
}); 