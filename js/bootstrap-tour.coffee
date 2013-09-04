class window.Tour
  constructor: (steps, introStep) ->
    @steps = []
    @stepsById = {}
    @stepsByGroup = {}
    for step in steps
      if step instanceof TourGroup
        @addTourGroup(step)
      else
        @addStep(step)
    @introStep = introStep
    Tour.setCurrent(this)

  @current: ->
    @currentTour

  @setCurrent: (tour) ->
    @currentTour = tour

  start: ->
    Tour.setCurrent this

    if @savedState()
      @show(@savedState())
    else
      @startOver()

  showIntro: -> 
    return unless @introStep
    @close()
    @intro = @renderModal("tour-start", '<div id="tour-start" class="modal hide"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i></button><h3 class="title">' + @introStep.title + '</h3></div><div class="modal-body" style="max-height:550px;">' + @introStep.content + @buildDropdown() + '<a href="#" class="btn btn-primary pull-right" data-tour="start">Start</a></div></div>', {modalWidth: 400});

  startOver: ->
    @show(@steps[0])

  end: ->
    @close()
    @clearState()

  gotoPage: (step) ->
    return false unless step.page

    [pageRegex, pageUrl] = step.page()

    return false if window.location.pathname.match(pageRegex)

    window.location.href = pageUrl
    true

  nextStep: ->
    @steps[@currentStep + 1] ?= null

  prevStep: ->
    @steps[@currentStep - 1] ?= null

  next: ->
    @show(@nextStep())

  prev: ->
    @show(@prevStep())

  cancel: ->
    @close()

  close: ->
    $('body').trigger('expose:hide')
    @modal.modal('hide') if @modal
    @popover.hide() if @popover
    @intro.modal('hide') if @intro

  addStep: (step, group) ->
    step.index = @steps.length
    @steps.push step
    @stepsById[step.id] = step
    group or= null
    @stepsByGroup[group] or= []
    @stepsByGroup[group].push step

  addTourGroup: (tourGroup) ->
    @addStep(step, tourGroup.name) for step in tourGroup.steps

  findStep: (id) ->
    return id if typeof(id) == "object"
    @stepsById[id]

  show: (id) ->
    Tour.setCurrent this

    step = @findStep(id)
    return if @gotoPage(step)

    @saveState(step)
    return if step.beforeShow && step.beforeShow()
    @close()
    @build(step)
    @expose(step)

  saveState: (step) ->
    localStorage['tourStep'] = step.id if localStorage
    @currentStep = step.index

  savedState: ->
    localStorage['tourStep'] if localStorage

  clearState: ->
    localStorage.removeItem('tourStep') if localStorage
    @currentStep = null

  build: (step) ->
    if step.type == "modal"
      @buildModal(step)
      @modal.modal 'show'
    else
      @buildPopover(step)
      @popover.show()
    @buttons(step)

  buildModal: (step) ->
    if @modal
      @modal.find('.modal-body p').html(step.content)
      @modal.find('.modal-header h3').html(step.title)
    else
      @modal = @renderModal('tour-modal', '<div id="tour-modal" class="modal hide"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i></button><h3 class="title">' + definition.title + '</h3></div><div class="modal-body" style="max-height:550px;"><p>' + definition.content + '</p>' + this.buildActions() + '</div></div>', {modalWidth: 400});
    @modal

  buildPopover: (step) ->
    link = $(step.anchor)
    title = '<a class="close" data-tour="cancel"><i class="icon-remove"></i></a>' + step.title
    content = step.content + '<br/><br/>' + @buildActions()
    if @popover
      @popover.options.content = content
      @popover.options.title = title
      @popover.options.placement = step.placement
      @popover.$element = link
    else
      @popover = link.popover({
        animation: false,
        placement: step.placement
        trigger: 'manual',
        content: content,
        title: title,
        html: true
      }).data('popover')
      @popover.tip().width(400).addClass('tour-popover')
      @popover.show()
    @popover

  buildDropdown: -> 
    if !@dropdown
      options = ""
      for name, steps of @stepsByGroup
        options += '<optgroup label="' + name + '">' unless name == "null"
        options += ('<option data-step="' + step.id + '">' + step.title + '</option>' for step in steps).join("")
        options += '</optgroup>' unless name == "null"
      @dropdown = '<select class="tour-goto"><option>Jump to...</option>' + options + '</select>';
    @dropdown

  buildActions: ->
    @actions = @buildDropdown() + '<div class="tour-buttons pull-right"><a class="btn btn" data-tour="prev" href="#">Prev</a> <a class="btn btn-primary" data-tour="next" href="#">Next</a><a class="btn btn-primary" data-tour="end" href="#">Close</a><span class="button-annotation message-ue"></span></div>' unless @actions
    @actions

  expose: (step) ->
    $(step.expose).expose({padding: step.exposePadding, static: true}) if step.expose

  buttons: (step) ->
    if @prevStep()
      $('*[data-tour=prev').show()
    else
      $('*[data-tour=prev').hide()

    if @nextStep()
      $('*[data-tour=next]').show()
      $('*[data-tour=end]').hide()
    else
      $('*[data-tour=next]').hide()
      $('*[data-tour=end]').show()

  renderModal: (id, html, options) ->
    # hide other modals
    $(".modal").each (i, el) ->
      $(el).modal('hide') if($(el).data('modal'))

    options or= {}
    modalWidth = options.modalWidth || 760
    $("#" + id).remove()

    $("body").append(html);
    modal = $("#" + id);
    if(modalWidth == "auto")
      modal.css({width: "auto"}).css({marginLeft: modal.width()/-2 + "px"});
    else
      modal.css({width: modalWidth + 'px', marginLeft: (modalWidth/-2) + "px"});
   
    modal.css({
      height: options.modalHeight + 'px'
    }) if(options.modalHeight)
    
    modal.find('.modal-body').prepend('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i></button>') if(options.addCloseButton)

    modal.modal(options).css({marginTop: (modal.outerHeight()/-2 + 'px')}).modal('show');
    modal;

class window.TourGroup
  constructor: (@name, @steps) ->

class window.TourStep
  constructor: (@id, @title, @content, @options) ->
    @options or= {}
    @type = @options.type || 'modal'
    @expose = @options.expose
    @exposePadding = @options.exposePadding
    @anchor = @options.anchor
    @placement = @options.placement
    @page = @options.page
    @beforeShow = @options.beforeShow

$ -> 
  $("body").on("click", "*[data-tour]", (evt) ->
    currentTour = Tour.current()
    currentTour[$(this).attr('data-tour')].call(currentTour) if currentTour
    evt.preventDefault();
    return false;
  ).keyup((evt) ->
    currentTour = Tour.current()
    currentTour.close() if evt.keyCode == 27 && currentTour
  ).on("change", "select.tour-goto", (evt) ->
    currentTour = Tour.current()
    selected = $(evt.target).find("option:selected")
    step = selected.attr("data-step");
      
    currentTour.show(step) if currentTour

    evt.preventDefault();
    return false;
  )
