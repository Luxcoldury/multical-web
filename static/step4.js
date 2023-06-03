document.getElementById('multical_carousel').addEventListener('slide.bs.carousel', event => {
    if(event.to==3){
      loadstep4();
    }
  })
  
  loadstep4 = function(){
      $(".step4-lidar-item").addClass("d-none")
      
      if($(".step1-lidar.active").length>0){
          $(".step4-lidar-placeholder").addClass("d-none")
      }else{
          $(".step4-lidar-placeholder").removeClass("d-none")
      }
  
      for(i=0;i<$(".step1-lidar.active").length;i++){
          bi=$(".step1-lidar.active")[i].getAttribute("data-bag-index")
          ti=$(".step1-lidar.active")[i].getAttribute("data-topic-index")
          item = topics.filter(function(topic) {
              return topic.bag_index == bi && topic.topic_index == ti;
          })[0]
  
          if($(`#step4-lidar-${item.bag_index}-${item.topic_index}`).length!=0){
              $(`#step4-lidar-${item.bag_index}-${item.topic_index}`).removeClass("d-none")
              continue
          }
  
          $("#step4-lidar-list").append(`<div class="list-group-item step4-lidar-item" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}" id="step4-lidar-${item.bag_index}-${item.topic_index}">
                <div class="row align-items-center">
                    <div class="col-6">
                        ${item.topic}
                        <div class="small">${bags[item.bag_index].bag_folder}</div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating ">
                            <div class="input-group  justify-content-center">
                                <span class="input-group-text">Relative Point Timestamp</span>
                                <input type="radio" class="btn-check" name="lidar-${item.bag_index}-${item.topic_index}-rt" id="lidar-${item.bag_index}-${item.topic_index}-rt-true" autocomplete="off" checked>
                                <label class="btn btn-outline-secondary" for="lidar-${item.bag_index}-${item.topic_index}-rt-true">True</label>
                                <input type="radio" class="btn-check" name="lidar-${item.bag_index}-${item.topic_index}-rt" id="lidar-${item.bag_index}-${item.topic_index}-rt-false" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="lidar-${item.bag_index}-${item.topic_index}-rt-false">False</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating ">
                            <input type="number" class="form-control form-control-sm" id="lidar-${item.bag_index}-${item.topic_index}-rp" placeholder="Reserved Points Per Frame" value="500">
                            <label for="lidar-${item.bag_index}-${item.topic_index}-rp" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}">Reserved Points Per Frame</label>
                        </div>
                    </div>
                </div>
            </div>`);
      }
  }