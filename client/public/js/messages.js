$('.messagesRead').on('click',(e)=>{
    $.ajax({
        type: "post",
        url: '/ReadMessage',
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
$('.deletarMensagens').on('click',(e)=>{
    $.ajax({
        type: "post",
        url: '/deleteMessage',
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
