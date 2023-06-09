var external_imu_configs = [];
var imu_config_selected_for_applying = {}

document.getElementById('multical_carousel').addEventListener('slide.bs.carousel', event => {
  if(event.to==1){
    loadstep2();
    get_external_imu_configs();
  }
})

loadstep2 = function(){
    $(".step2-imu-item").addClass("d-none")
    
    if($(".step1-imu.active").length>0){
        $(".imu-placeholder").addClass("d-none")
    }else{
        $(".imu-placeholder").removeClass("d-none")
    }

    for(i=0;i<$(".step1-imu.active").length;i++){
        bi=$(".step1-imu.active")[i].getAttribute("data-bag-index")
        ti=$(".step1-imu.active")[i].getAttribute("data-topic-index")
        item = topics.filter(function(topic) {
            return topic.bag_index == bi && topic.topic_index == ti;
        })[0]

        if($(`#step2-imu-${item.bag_index}-${item.topic_index}`).length!=0){
            $(`#step2-imu-${item.bag_index}-${item.topic_index}`).removeClass("d-none")
            continue
        }

        $("#step2-imu-list").append(`<div class="list-group-item step2-imu-item" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}" id="step2-imu-${item.bag_index}-${item.topic_index}">
            <div class="row align-items-center">
                <div class="col-2">
                    ${item.topic}
                    <div class="small">${bags[item.bag_index].bag_folder}</div>
                </div>
                <div class="col-2">
                    <div class="form-floating ">
                        <input type="text" class="form-control" id="imu-${item.bag_index}-${item.topic_index}-and" placeholder="Accel Noise Density">
                        <label for="imu-${item.bag_index}-${item.topic_index}-and" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}">Accel Noise Density</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="form-floating ">
                        <input type="text" class="form-control" id="imu-${item.bag_index}-${item.topic_index}-arw" placeholder="Accel Random Walk">
                        <label for="imu-${item.bag_index}-${item.topic_index}-arw" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}">Accel Random Walk</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="form-floating ">
                        <input type="text" class="form-control" id="imu-${item.bag_index}-${item.topic_index}-gnd" placeholder="Gyro Noise Density">
                        <label for="imu-${item.bag_index}-${item.topic_index}-gnd" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}">Gyro Noise Density</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="form-floating ">
                        <input type="text" class="form-control" id="imu-${item.bag_index}-${item.topic_index}-grw" placeholder="Gyro Random Walk">
                        <label for="imu-${item.bag_index}-${item.topic_index}-grw" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}">Gyro Random Walk</label>
                    </div>
                </div>
                <div class="col-2 step2-imu-ur-col">
                    <div class="form-floating ">
                        <input type="number" class="form-control" id="imu-${item.bag_index}-${item.topic_index}-rate" placeholder="Update Rate">
                        <label for="imu-${item.bag_index}-${item.topic_index}-rate" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}">Update Rate</label>
                    </div>
                </div>
                <div class="col-1 step2-imu-apply-config-col d-none">
                    <a role="button" class="btn btn-primary" href="javascript:apply_imu_config_to(${item.bag_index},${item.topic_index})">Apply</a>
                </div>
            </div>
        </div>`);
    }
}


const gnd_symbol = `<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="27"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-msub><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D70E TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-texatom size="s"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D454 TEX-I"></mjx-c></mjx-mi></mjx-texatom></mjx-script></mjx-msub></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>σ</mi><mrow data-mjx-texclass="ORD"><mi>g</mi></mrow></msub></math></mjx-assistive-mml></mjx-container></math-renderer> (<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="28"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mrow size="s"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D45F TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44E TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D451 TEX-I"></mjx-c></mjx-mi></mjx-mrow></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-mi size="s" class="mjx-i"><mjx-c class="mjx-c1D460 TEX-I"></mjx-c></mjx-mi></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mn size="s" class="mjx-n"><mjx-c class="mjx-c31"></mjx-c></mjx-mn></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-msqrt size="s"><mjx-sqrt><mjx-surd><mjx-mo class="mjx-n"><mjx-c class="mjx-c221A"></mjx-c></mjx-mo></mjx-surd><mjx-box style="padding-top: 0.16em;"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43B TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D467 TEX-I"></mjx-c></mjx-mi></mjx-box></mjx-sqrt></mjx-msqrt></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mi>r</mi><mi>a</mi><mi>d</mi></mrow><mi>s</mi></mfrac><mfrac><mn>1</mn><msqrt><mi>H</mi><mi>z</mi></msqrt></mfrac></math></mjx-assistive-mml></mjx-container></math-renderer>)`
const and_symbol = `<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="29"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-msub><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D70E TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-texatom size="s"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44E TEX-I"></mjx-c></mjx-mi></mjx-texatom></mjx-script></mjx-msub></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>σ</mi><mrow data-mjx-texclass="ORD"><mi>a</mi></mrow></msub></math></mjx-assistive-mml></mjx-container></math-renderer> (<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="30"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mi size="s" class="mjx-i"><mjx-c class="mjx-c1D45A TEX-I"></mjx-c></mjx-mi></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-msup size="s"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D460 TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: 0.289em;"><mjx-mn size="s" class="mjx-n"><mjx-c class="mjx-c32"></mjx-c></mjx-mn></mjx-script></mjx-msup></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mn size="s" class="mjx-n"><mjx-c class="mjx-c31"></mjx-c></mjx-mn></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-msqrt size="s"><mjx-sqrt><mjx-surd><mjx-mo class="mjx-n"><mjx-c class="mjx-c221A"></mjx-c></mjx-mo></mjx-surd><mjx-box style="padding-top: 0.16em;"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43B TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D467 TEX-I"></mjx-c></mjx-mi></mjx-box></mjx-sqrt></mjx-msqrt></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mi>m</mi><msup><mi>s</mi><mn>2</mn></msup></mfrac><mfrac><mn>1</mn><msqrt><mi>H</mi><mi>z</mi></msqrt></mfrac></math></mjx-assistive-mml></mjx-container></math-renderer>)`
const grw_symbol = `<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="31"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-msub><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D70E TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-texatom size="s"><mjx-msub><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44F TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-mi size="s" class="mjx-i"><mjx-c class="mjx-c1D454 TEX-I"></mjx-c></mjx-mi></mjx-script></mjx-msub></mjx-texatom></mjx-script></mjx-msub></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>σ</mi><mrow data-mjx-texclass="ORD"><msub><mi>b</mi><mi>g</mi></msub></mrow></msub></math></mjx-assistive-mml></mjx-container></math-renderer> (<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="32"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mrow size="s"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D45F TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44E TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D451 TEX-I"></mjx-c></mjx-mi></mjx-mrow></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-msup size="s"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D460 TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: 0.289em;"><mjx-mn size="s" class="mjx-n"><mjx-c class="mjx-c32"></mjx-c></mjx-mn></mjx-script></mjx-msup></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mn size="s" class="mjx-n"><mjx-c class="mjx-c31"></mjx-c></mjx-mn></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-msqrt size="s"><mjx-sqrt><mjx-surd><mjx-mo class="mjx-n"><mjx-c class="mjx-c221A"></mjx-c></mjx-mo></mjx-surd><mjx-box style="padding-top: 0.16em;"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43B TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D467 TEX-I"></mjx-c></mjx-mi></mjx-box></mjx-sqrt></mjx-msqrt></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mi>r</mi><mi>a</mi><mi>d</mi></mrow><msup><mi>s</mi><mn>2</mn></msup></mfrac><mfrac><mn>1</mn><msqrt><mi>H</mi><mi>z</mi></msqrt></mfrac></math></mjx-assistive-mml></mjx-container></math-renderer>)`
const arw_symbol = `<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="33"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-msub><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D70E TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-texatom size="s"><mjx-msub><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44F TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-mi size="s" class="mjx-i"><mjx-c class="mjx-c1D44E TEX-I"></mjx-c></mjx-mi></mjx-script></mjx-msub></mjx-texatom></mjx-script></mjx-msub></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>σ</mi><mrow data-mjx-texclass="ORD"><msub><mi>b</mi><mi>a</mi></msub></mrow></msub></math></mjx-assistive-mml></mjx-container></math-renderer> (<math-renderer class="js-inline-math" style="display: inline" data-static-url="https://github.githubassets.com/static" data-run-id="99d94e2d576ace565580fd187f9488e8" data-catalyst=""><mjx-container style="position: relative;" jax="CHTML" class="MathJax CtxtMenu_Attached_0" tabindex="0" ctxtmenu_counter="34"><mjx-math aria-hidden="true" class="MJX-TEX"><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mi size="s" class="mjx-i"><mjx-c class="mjx-c1D45A TEX-I"></mjx-c></mjx-mi></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-msup size="s"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D460 TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: 0.289em;"><mjx-mn size="s" class="mjx-n"><mjx-c class="mjx-c33"></mjx-c></mjx-mn></mjx-script></mjx-msup></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac><mjx-mfrac><mjx-frac><mjx-num><mjx-nstrut></mjx-nstrut><mjx-mn size="s" class="mjx-n"><mjx-c class="mjx-c31"></mjx-c></mjx-mn></mjx-num><mjx-dbox><mjx-dtable><mjx-line></mjx-line><mjx-row><mjx-den><mjx-dstrut></mjx-dstrut><mjx-msqrt size="s"><mjx-sqrt><mjx-surd><mjx-mo class="mjx-n"><mjx-c class="mjx-c221A"></mjx-c></mjx-mo></mjx-surd><mjx-box style="padding-top: 0.16em;"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43B TEX-I"></mjx-c></mjx-mi><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D467 TEX-I"></mjx-c></mjx-mi></mjx-box></mjx-sqrt></mjx-msqrt></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac></mjx-math><mjx-assistive-mml display="inline" unselectable="on"><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mi>m</mi><msup><mi>s</mi><mn>3</mn></msup></mfrac><mfrac><mn>1</mn><msqrt><mi>H</mi><mi>z</mi></msqrt></mfrac></math></mjx-assistive-mml></mjx-container></math-renderer>)`


get_external_imu_configs = function(){
    $.get("/api/load_imu_configs_files",
        function (data) {
            external_imu_configs = data;
            
            if(external_imu_configs.length==0) return

            $("#step2-rw-file-list").empty()
            for(i=0;i<external_imu_configs.length;i++){
                imu_config = external_imu_configs[i]

                $("#step2-rw-file-list").append(`<div class="list-group-item list-group-item-action step2-rw-file-item" id="step2-rw-file-${i}">
                    <a href="javascript:select_imu_config_for_applying(${i})" class="stretched-link"></a>
                    <div class="row align-items-center">
                        <div class="col">
                            ${imu_config.config_name}
                            <div class="small">${imu_config.config_folder}</div>
                        </div>
                    </div>
                </div>`);
            }
        },
        "json"
    );
}

apply_imu_config = function(index){
    bi=$(".step2-imu-item")[0].getAttribute("data-bag-index")
    ti=$(".step2-imu-item")[0].getAttribute("data-topic-index")

    $(`#imu-${bi}-${ti}-and`).val(external_imu_configs[index].config.and)
    $(`#imu-${bi}-${ti}-arw`).val(external_imu_configs[index].config.arw)
    $(`#imu-${bi}-${ti}-gnd`).val(external_imu_configs[index].config.gnd)
    $(`#imu-${bi}-${ti}-grw`).val(external_imu_configs[index].config.grw)
}

select_imu_config_for_applying = function(index){
    imu_config_selected_for_applying = external_imu_configs[index]
    $(".step2-imu-ur-col").removeClass("col-2")
    $(".step2-imu-ur-col").addClass("col-1")
    $(".step2-rw-file-item").removeClass("active")
    $(".step2-imu-apply-config-col").removeClass("d-none")
    $(`#step2-rw-file-${index}`).addClass("active")
}

apply_imu_config_to = function(bi,ti){
    $(".step2-imu-ur-col").addClass("col-2")
    $(".step2-imu-ur-col").removeClass("col-1")
    $(".step2-rw-file-item").removeClass("active")
    $(".step2-imu-apply-config-col").addClass("d-none")

    $(`#imu-${bi}-${ti}-and`).val(imu_config_selected_for_applying.config.and)
    $(`#imu-${bi}-${ti}-arw`).val(imu_config_selected_for_applying.config.arw)
    $(`#imu-${bi}-${ti}-gnd`).val(imu_config_selected_for_applying.config.gnd)
    $(`#imu-${bi}-${ti}-grw`).val(imu_config_selected_for_applying.config.grw)
}