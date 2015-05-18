require(['material', 'jquery'], function (material, $) {
    material.init();

   console.log($("form#ttldl"));

    $("form#ttldl").submit(function(){
        console.log("dfg");
        $("#use").attr("disabled", "disabled");
        $("#use").html("Uploading...");
    });
});