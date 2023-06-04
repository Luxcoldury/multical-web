var external_cam_configs = [];

document.getElementById('multical_carousel').addEventListener('slide.bs.carousel', event => {
    if(event.to==2){
      loadstep3();
      get_external_cam_configs();
    }
})
  
loadstep3 = function(){
    $(".step3-camera-item").addClass("d-none")
    
    if($(".step1-camera.active").length>0){
        $(".step3-camera-placeholder").addClass("d-none")
    }else{
        $(".step3-camera-placeholder").removeClass("d-none")
        $(".step3-intrinsics-placeholder").removeClass("d-none")
        $(".step3-intrinsics-item").addClass("d-none")
    }

    for(i=0;i<$(".step1-camera.active").length;i++){
        bi=$(".step1-camera.active")[i].getAttribute("data-bag-index")
        ti=$(".step1-camera.active")[i].getAttribute("data-topic-index")
        item = topics.filter(function(topic) {
            return topic.bag_index == bi && topic.topic_index == ti;
        })[0]

        if($(`#step3-camera-${item.bag_index}-${item.topic_index}`).length!=0){
            $(`#step3-camera-${item.bag_index}-${item.topic_index}`).removeClass("d-none")
            continue
        }

        $("#step3-camera-list").append(`<div class="list-group-item step3-camera-item" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}" id="step3-camera-${item.bag_index}-${item.topic_index}">
            <a href="javascript:step3_choose_camera(${item.bag_index},${item.topic_index})" class="stretched-link"></a>
            <div class="row align-items-center">
                <div class="col-12">
                ${item.topic}
                <div class="small"><mark>${item.msgtype}</mark></div>
                <div class="small">${bags[item.bag_index].bag_folder}/${bags[item.bag_index].bag_name}</div>
            </div>
        </div>`);
    }
}


step3_choose_camera = function(bag_index,topic_index){
    $(".step3-camera-item").removeClass("active")
    $(`#step3-camera-${bag_index}-${topic_index}`).addClass("active")

    $(".step3-intrinsics-placeholder").addClass("d-none")
    $(".step3-intrinsics-item").addClass("d-none")    
    $(".step3-intrinsics-item").removeClass("front")    

    if($(`#step3-intrinsics-${bag_index}-${topic_index}`).length>0){
        $(`#step3-intrinsics-${bag_index}-${topic_index}`).removeClass("d-none")
        $(`#step3-intrinsics-${bag_index}-${topic_index}`).addClass("front")
        return
    }

    $("#step3-intrinsics-list").append(`<div class="list-group-item step3-intrinsics-item front" style="text-align: center; height:100%" id="step3-intrinsics-${bag_index}-${topic_index}" data-bag-index="${bag_index}" data-topic-index="${topic_index}">
    <div class="row g-4 align-items-center">
        <div class="col-12">
            <table class="table table-bordered border-0" style="vertical-align:middle;">
                <tbody>
                <tr>
                    <td rowspan="3" class="w-25">Camera Matrix = </td>
                    <td class="w-25" style="height: 75px;">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-fu" placeholder="fu">
                            <label for="camera-${bag_index}-${topic_index}-fu" data-bag-index="${bag_index}" data-topic-index="${topic_index}">fu</label>
                        </div>
                    </td>
                    <td class="table-active w-25">0</td>
                    <td class="w-25">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-pu" placeholder="pu">
                            <label for="camera-${bag_index}-${topic_index}-pu" data-bag-index="${bag_index}" data-topic-index="${topic_index}">pu</label>
                        </div>
                    </td>
                </tr>
                <tr style="height: 75px;">
                    <td class="table-active">0</td>
                    <td>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-fv" placeholder="fv">
                            <label for="camera-${bag_index}-${topic_index}-fv" data-bag-index="${bag_index}" data-topic-index="${topic_index}">fv</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-pv" placeholder="pv">
                            <label for="camera-${bag_index}-${topic_index}-pv" data-bag-index="${bag_index}" data-topic-index="${topic_index}">pv</label>
                        </div>
                    </td>
                </tr>
                <tr class="table-active" style="height: 75px;">
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row g-4">
        <div class="col-3">
            <div class="input-group mb-3 justify-content-center">
                <span class="input-group-text">Camera Model</span>
                <input type="radio" class="btn-check camera-${bag_index}-${topic_index}-camera-model" name="camera-${bag_index}-${topic_index}-camera-model" id="camera-${bag_index}-${topic_index}-camera-model-pinhole" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="camera-${bag_index}-${topic_index}-camera-model-pinhole">pinhole</label>
            </div>
        </div>
        <div class="col-9">
            <div class="input-group mb-3">
                <span class="input-group-text">Resolution</span>
                <input type="number" class="form-control" placeholder="Width" aria-label="Width" id="camera-${bag_index}-${topic_index}-width">
                <span class="input-group-text">*</span>
                <input type="number" class="form-control" placeholder="Height" aria-label="Height" id="camera-${bag_index}-${topic_index}-height">
            </div>
        </div>
    </div>

    
    <div class="row g-4">
        <div class="col-12">
            <div class="input-group mb-3 justify-content-center">
                <span class="input-group-text">Distortion Model</span>
                <input type="radio" class="btn-check" name="camera-${bag_index}-${topic_index}-distortion-model" id="camera-${bag_index}-${topic_index}-distortion-model-radtan" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="camera-${bag_index}-${topic_index}-distortion-model-radtan">radtan</label>
                <input type="radio" class="btn-check" name="camera-${bag_index}-${topic_index}-distortion-model" id="camera-${bag_index}-${topic_index}-distortion-model-equidistant" autocomplete="off">
                <label class="btn btn-outline-secondary" for="camera-${bag_index}-${topic_index}-distortion-model-equidistant">equi</label>
                <span class="input-group-text">Coefficients</span>
                <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-distortion-1">
                <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-distortion-2">
                <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-distortion-3">
                <input type="text" class="form-control" id="camera-${bag_index}-${topic_index}-distortion-4">
            </div>
        </div>
    </div>

</div>`)
}

get_external_cam_configs = function(){
    $.get("/api/load_cam_configs_files",
        function (data) {
            external_cam_configs = data;
            
            if(external_cam_configs.length==0) return

            $("#step3-intrinsics-file-list").empty()
            for(i=0;i<external_cam_configs.length;i++){
                cam_config = external_cam_configs[i]

                $("#step3-intrinsics-file-list").append(`<div class="list-group-item list-group-item-action step3-intrinsics-file-item">
                    <a href="javascript:apply_cam_config(${i})" class="stretched-link"></a>
                    <div class="row align-items-center">
                        <div class="col">
                            ${cam_config.config_name}
                            <div class="small">${cam_config.config_folder}</div>
                        </div>
                    </div>
                </div>`);
            }
        },
        "json"
    );
}

apply_cam_config = function(index){
    bi=$(".step3-intrinsics-item.front")[0].getAttribute("data-bag-index")
    ti=$(".step3-intrinsics-item.front")[0].getAttribute("data-topic-index")

    $(`#camera-${bi}-${ti}-fu`).val(external_cam_configs[index].config.intrinsics[0])
    $(`#camera-${bi}-${ti}-fv`).val(external_cam_configs[index].config.intrinsics[1])
    $(`#camera-${bi}-${ti}-pu`).val(external_cam_configs[index].config.intrinsics[2])
    $(`#camera-${bi}-${ti}-pv`).val(external_cam_configs[index].config.intrinsics[3])

    $(`#camera-${bi}-${ti}-width`).val(external_cam_configs[index].config.resolution[0])
    $(`#camera-${bi}-${ti}-height`).val(external_cam_configs[index].config.resolution[1])

    $(`#camera-${bi}-${ti}-distortion-model-${external_cam_configs[index].config.distortion_model}`).prop('checked',true)    
    $(`#camera-${bi}-${ti}-distortion-1`).val(external_cam_configs[index].config.distortion_coeffs[0])
    $(`#camera-${bi}-${ti}-distortion-2`).val(external_cam_configs[index].config.distortion_coeffs[1])
    $(`#camera-${bi}-${ti}-distortion-3`).val(external_cam_configs[index].config.distortion_coeffs[2])
    $(`#camera-${bi}-${ti}-distortion-4`).val(external_cam_configs[index].config.distortion_coeffs[3])

}