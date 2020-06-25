// Show Control Tabs
function initView(){
    document.getElementById("rotatingBtn").click();
}
function openControls(evt, contName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(contName).style.display = "block";
    evt.currentTarget.className += " active";
}

function uploadImgPreview() {
  let fileInfo = document.getElementById("upImgFile").files[0];
  let reader = new FileReader();
  reader.onload = function() {
        var img = new Image;
        img.src = reader.result;
        img.onload = function() {
          var canvas=document.createElement("canvas");
          var ctx=canvas.getContext("2d");
          var iwScaled=256;
          var ihScaled=256;
          canvas.width=iwScaled;
          canvas.height=ihScaled;
          ctx.drawImage(img,0,0,iwScaled,ihScaled);
          var thumb=new Image();
          thumb.src=canvas.toDataURL();
          
          getBase64imgSrc(thumb.src);
          document.getElementById("thumbnailImg").src = thumb.src
        }
  };
  if( fileInfo ) {
    reader.readAsDataURL( fileInfo );
  }
}