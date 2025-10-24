/* **************************************************************************
  SigCaptX-Wizard-Main.js
   
  This file contains the main control functions for controlling the 
  wizard session plus some global variables and functions for defining the object classes
  which are defined in SigCaptX-Wizard-PadDefs.js.
  
  Copyright (c) 2018 Wacom Co. Ltd. All rights reserved.
  
  v4.0
  
***************************************************************************/

/* The function step1() is the controlling routine for setting up and displaying the objects
   on the first screen in the wizard sequence. This is the screen with the checkbox */
   function step1() {
    wizCtl.Reset(step1_onWizCtlReset);
  
    function step1_onWizCtlReset(wizCtlV, status) {
      if (wgssSignatureSDK.ResponseStatus.OK == status) {
        setFont(
          display_1.stepMsg1.fontName,
          display_1.stepMsg1.fontSize,
          display_1.stepMsg1.fontBold,
          false,
          step1_onPutFontStepMsg1
        );
      } else {
        print("WizCtl Reset" + status);
        if (wgssSignatureSDK.ResponseStatus.INVALID_SESSION == status) {
          actionWhenRestarted(window.Step1);
        }
      }
    }
  
    function step1_onPutFontStepMsg1(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFontStepMsg1", status)) {
        addTextObject(display_1.stepMsg1, step1_onAddTextStep1);
      }
    }
  
    function step1_onAddTextStep1(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddObject", status)) {
        if (pad.Range == "300") {
          addLine(display_1.step1Line, step1_onAddRectangle);
        } else {
          addRectangle(display_1.step1Rectangle, step1_onAddRectangle);
        }
      }
    }
  
    function step1_onAddRectangle(wizCtlV, status) {
      if (callbackStatusOK("WizCtl Primitive", status)) {
        setFont(
          display_1.infoText.fontName,
          display_1.infoText.fontSize,
          display_1.infoText.fontBold,
          false,
          step1_onPutFontInfoText
        );
      }
    }
  
    function step1_onPutFontInfoText(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFontInfoText", status)) {
        /* If we are using a colour pad then set the colour of the foreground and background fonts up now if defined in the text object */
        if (display_1.infoText.fontForeColor != "") {
          setFontForeColor(
            display_1.infoText.fontForeColor,
            step1_onSetFontForeColor
          );
        } else {
          addTextObject(display_1.infoText, step1_onAddTextSigningText);
        }
      } else {
        addTextObject(display_1.infoText, step1_onAddTextSigningText);
      }
    }
  
    function step1_onSetFontForeColor(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontForeColor", status)) {
        // If a foreground colour has been set then we assume a background colour must also be required
        setFontBackColor(
          display_1.infoText.fontBackColor,
          step1_onSetFontBackColor
        );
      }
    }
  
    function step1_onSetFontBackColor(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontBackColor", status)) {
        // After setting up the font colours set up the text string itself
        addTextObject(display_1.infoText, step1_onAddTextSigningText);
      }
    }
  
    function step1_onAddTextInfoText(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddTextInfoText", status)) {
        setFont(
          display_1.checkboxObj.fontName,
          display_1.checkboxObj.fontSize,
          display_1.checkboxObj.fontBold,
          false,
          step1_onPutFontCheckbox
        );
      }
    }
  
    function step1_onPutFontCheckbox(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFontCheckbox", status)) {
        addCheckBox(
          display_1.checkboxObj.xPos,
          display_1.checkboxObj.yPos,
          display_1.checkboxObj.options,
          step1_onAddCheck
        );
      }
    }
  
    function step1_onAddCheck(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddCheck", status)) {
        setFont(
          display_1.signingText.fontName,
          display_1.signingText.fontSize,
          display_1.signingText.fontBold,
          false,
          step1_onPutFontSigningText
        );
      }
    }
  
    function step1_onPutFontSigningText(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFontSigningText", status)) {
        /* If we are using a colour pad then set the colour of the foreground and background fonts up now if defined in the text object */
        if (display_1.signingText.fontForeColor != "") {
          setFontForeColor(
            display_1.signingText.fontForeColor,
            step1_onSetSigningTextFontForeColor
          );
        } else {
          addTextObject(display_1.signingText, step1_onAddTextSigningText);
        }
      }
    }
  
    function step1_onSetSigningTextFontForeColor(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetSigningTextFontForeColor", status)) {
        // If a foreground colour has been set then we assume a background colour must also be required
        setFontBackColor(
          display_1.signingText.fontBackColor,
          step1_onSetSigningTextFontBackColor
        );
      }
    }
  
    function step1_onSetSigningTextFontBackColor(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetSigningTextFontBackColor", status)) {
        // After setting up the font colours set up the text string itself
        addTextObject(display_1.signingText, step1_onAddTextSigningText);
      }
    }
  
    function step1_onAddTextSigningText(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddTextSigningText", status)) {
        if (display_1.nextToContinue.fontForeColor != "") {
          setFontForeColor(
            display_1.nextToContinue.fontForeColor,
            step1_onSetContinueTextFontForeColor
          );
        } else {
          addTextObject(display_1.nextToContinue, step1_onAddTextNextCont);
        }
      }
    }
  
    function step1_onSetContinueTextFontForeColor(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetContinueTextFontForeColor", status)) {
        // If a foreground colour has been set then we assume a background colour must also be required
        setFontBackColor(
          display_1.nextToContinue.fontBackColor,
          step1_onSetContinueTextFontBackColor
        );
      }
    }
  
    function step1_onSetContinueTextFontBackColor(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetContinueTextFontBackColor", status)) {
        // After setting up the font colours set up the text string itself
        addTextObject(display_1.nextToContinue, step1_onAddTextNextCont);
      }
    }
  
    function step1_onAddTextNextCont(wizCtlV, status) {
      //print("step1_onAddTextNextCont");
      if (callbackStatusOK("WizCtl AddTextNextCont", status)) {
        setFont(
          pad.Font,
          display_1.cancelButton.buttonSize,
          display_1.cancelButton.buttonBold,
          false,
          step1_onPutFontCancel
        );
      }
    }
  
    function step1_onPutFontCancel(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFontCancel", status)) {
        var buttonSource = getButtonSourceFromHTMLDoc();
  
        if (buttonSource == textSource.STANDARD) {
          // Set up font colours if required for colour pads
          if (display_1.cancelButton.fontForeColor != "") {
            setFontForeColor(
              display_1.cancelButton.fontForeColor,
              step1_onSetCancelButtonFontForeColor
            );
          } else {
            addButtonObject(display_1.cancelButton, step1_onAddCancelButton);
          }
        } else {
          addObjectImage(
            display_1.cancelButton,
            step1_onAddCancelButton,
            display_1.cancelButton.imageFile
          );
        }
      }
  
      function step1_onSetCancelButtonFontForeColor(wizCtlV, status) {
        if (callbackStatusOK("WizCtl setFontCancelButtonForeColor", status)) {
          setFontBackColor(
            display_1.cancelButton.fontBackColor,
            step1_onSetCancelButtonFontBackColor
          );
        }
      }
  
      function step1_onSetCancelButtonFontBackColor(wizCtlV, status) {
        if (callbackStatusOK("WizCtl setCancelButtonFontBackColor", status)) {
          addButtonObject(display_1.cancelButton, step1_onAddCancelButton);
        }
      }
    }
  
    function step1_onAddCancelButton(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddCancelButton", status)) {
        /* If the user has chosen to use images for the buttons then add the image object, otherwise a standard button object */
        var buttonSource = getButtonSourceFromHTMLDoc();
  
        if (buttonSource == textSource.STANDARD) {
          addButtonObject(display_1.nextButton, step1_onAddNextButton);
        } else {
          addObjectImage(
            display_1.nextButton,
            step1_onAddNextButton,
            buttonSource
          );
        }
      }
    }
  
    function step1_onAddNextButton(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddNextButton", status)) {
        wizCtl.Display(step1_onDisplay);
      }
    }
  
    function step1_onDisplay(wizCtlV, status) {
      if (callbackStatusOK("WizCtl Display", status)) {
        wizCtl.SetEventHandler(step1_Handler);
      }
    }
  }
  
  /* This is the event handler for the user input on the first screen of the wizard */
  function step1_Handler(ctl, id, type, status) {
    function step1_onGetObjectState(wizCtlV, objState, status) {
      if (
        wgssSignatureSDK.VariantType.VARIANT_NUM == objState.type &&
        1 == objState.num
      ) {
        print("Check box was selected");
      }
      step2();
    }
  
    if (wgssSignatureSDK.ResponseStatus.OK == status) {
      switch (id) {
        case buttonEvent.NEXT:
          wizCtl.GetObjectState("Check", step1_onGetObjectState);
          break;
        case buttonEvent.CHECK:
          break;
        case buttonEvent.CANCEL:
          wizardEventController.script_Cancelled();
          break;
        default:
          print("Unexpected event: " + id);
          alert("Unexpected event: " + id);
          break;
      }
    } else {
      print("Wizard window closed");
      wizardEventController.script_Cancelled();
    }
  }
  
  /* The function step3() is the controlling routine for setting up and displaying the objects
     on the third screen in the wizard sequence, i.e. the one with the radio buttons */
  // function step3()
  // {
  //   wizCtl.Reset(step3_onWizCtlReset);
  
  //   function step3_onWizCtlReset(wizCtlV, status)
  //   {
  //     if(wgssSignatureSDK.ResponseStatus.OK == status)
  //     {
  //       setFont(display_3.stepMsg3.fontName, display_3.stepMsg3.fontSize, display_3.stepMsg3.fontWeight, false, step3_onPutFont);
  //     }
  //     else
  //     {
  //       print("WizCtl Reset" + status);
  //       if(wgssSignatureSDK.ResponseStatus.INVALID_SESSION == status)
  //       {
  //         actionWhenRestarted(window.Step3);
  //       }
  //     }
  //   }
  
  //   function step3_onPutFont(wizCtlV, status)
  //   {
  //     var fontForeColor = "";
  
  //     if(callbackStatusOK("WizCtl PutFont", status))
  //     {
  //       // In case font colours were changed on the previous screen make sure we revert to black on white now
  //       if (pad.Range == padRange.STU5X0)
  //       {
  //         if (display_3.stepMsg3.fontForeColor != "")
  //         {
  //           fontForeColor = display_3.stepMsg3.fontForeColor;
  //         }
  //         else
  //         {
  //           fontForeColor = padColors.BLACK;
  //         }
  //         setFontForeColor(fontForeColor, step3_onSetStepMsg2FontForeColor);
  //       }
  //       else
  //       {
  //         // For monochrome pads skip the setting of font colours
  //         addTextObject(display_3.stepMsg3, step3_onAddText1);
  //       }
  //     }
  //   }
  
  //   function step3_onSetStepMsg2FontForeColor(wizCtlV, status)
  //   {
  //     var fontBackColor;
  
  //     if(callbackStatusOK("WizCtl setStepMsg2FontForeColor", status))
  //     {
  //       if (display_3.stepMsg3.fontBackColor != "")
  //       {
  //         fontBackColor = display_3.stepMsg3.fontBackColor;
  //       }
  //       else
  //       {
  //         fontBackColor = padColors.WHITE;
  //       }
  //       setFontBackColor(fontBackColor, step3_onSetStepMsg2FontBackColor);
  //     }
  //   }
  
  //   function step3_onSetStepMsg2FontBackColor(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl setStepMsg2FontBackColor", status))
  //     {
  //       addTextObject(display_3.stepMsg3, step3_onAddText1);
  //     }
  //   }
  
  //   function step3_onAddText1(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddObject", status))
  //     {
  //       if (pad.Range == padRange.STU300)
  //       {
  //          addLine(display_3.step1Line, step3_onAddPrimitive1);
  //       }
  //       else
  //       {
  //          addRectangle( display_3.step3Rectangle, step3_onAddText4);
  //       }
  //     }
  //   }
  
  //   function step3_onAddText4(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddText4", status))
  //     {
  //       setFont(pad.Font, pad.ButtonSize, pad.TextBold, false, step3_onAddTextEnter);
  //     }
  //   }
  // ///From Display 3
  // function step3_onAddTextEnter(wizCtlV, status)
  // {
  //   if(callbackStatusOK("WizCtl AddText4", status))
  //   {
  //     setFont(display_3.enterBelow.fontName, display_3.enterBelow.fontSize, display_3.enterBelow.fontBold, false, onPutFontEnterBelow);
  //   }
  // }
  
  // function onPutFontEnterBelow(wizCtlV, status)
  // {
  //   if(callbackStatusOK("WizCtl PutFontEnterBelow", status))
  //   {
  //     // If font colour is required do it now
  //     if (display_3.enterBelow.fontForeColor != null && display_3.enterBelow.fontForeColor != "")
  //     {
  //       setFontForeColor(display_3.enterBelow.fontForeColor, step3_onSetFontForeColorEnterBelow);
  //     }
  //     else
  //     {
  //       addTextObject(display_3.enterBelow, onAddEnterBelow);
  //     }
  //   }
  // }
  
  // function step3_onSetFontForeColorEnterBelow(wizCtlV, status)
  // {
  //   if(callbackStatusOK("WizCtl SetFontForeColorEnterBelow", status))
  //   {
  //     // If a foreground colour has been set then we assume a background colour must also be required
  //     setFontBackColor(display_3.enterBelow.fontBackColor, step3_onSetFontBackColorEnterBelow);
  //   }
  // }
  
  // function step3_onSetFontBackColorEnterBelow(wizCtlV, status)
  // {
  //   if(callbackStatusOK("WizCtl SetFontBackColorEnterBelow", status))
  //   {
  //     // After setting up the font colours set up the text string itself
  //     addTextObject(display_3.enterBelow, step3_onAddEnterBelow);
  //   }
  // }
  
  // /* Next 9 functions - add the buttons for the 9 PINs */
  // function step3_onAddEnterBelow(wizCtlV, status)
  // {
  //   if(callbackStatusOK("WizCtl step1 AddEnterBelow", status))
  //   {
  //     // If font colour is required do it now
  //     if (display_3.pin1.fontForeColor != null && display_3.pin1.fontForeColor != "")
  //     {
  //       setFontForeColor(display_3.pin1.fontForeColor, step3_onSetFontForeColorPin1);
  //     }
  //     else
  //     {
  //       addButtonObject(display_3.pin1, step3_onAddPin1Button);
  //     }
  //   }
  // }
  
  // function step3_onSetFontForeColorPin1(wizCtlV, status)
  // {
  //   if(callbackStatusOK("WizCtl SetFontForeColorPin1", status))
  //   {
  //     // If a foreground colour has been set then we assume a background colour must also be required
  //     setFontBackColor(display_3.pin1.fontBackColor, step3_onSetFontBackColorPin1);
  //   }
  // }
  
  //   function step3_onSetFontBackColorPin1(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl SetFontBackColorPin1", status))
  //     {
  //       // After setting up the font colours set up the text string itself
  //       addButtonObject(display_3.pin1, step3_onAddPin1Button);
  //     }
  //   }
  
  //   function step3_onAddPin1Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl PutFontEnterBelow", status))
  //     {
  
  //       addButtonObject(display_3.pin2, onAddPin2Button);
  //     }
  //   }
  
  //   function onAddPin2Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin2Button", status))
  //     {
  
  //       addButtonObject(display_3.pin3, onAddPin3Button);
  //     }
  //   }
  
  //   function onAddPin3Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin3Button", status))
  //     {
  
  //       addButtonObject(display_3.pin4, onAddPin4Button);
  //     }
  //   }
  
  //   function onAddPin4Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin4Button", status))
  //     {
  
  //       addButtonObject(display_3.pin5, onAddPin5Button);
  //     }
  //   }
  
  //   function onAddPin5Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin5Button", status))
  //     {
  //       addButtonObject(display_3.pin6, onAddPin6Button);
  //     }
  //   }
  
  //   function onAddPin6Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin6Button", status))
  //     {
  //       addButtonObject(display_3.pin7, onAddPin7Button);
  //     }
  //   }
  
  //   function onAddPin7Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin7Button", status))
  //     {
  //       addButtonObject(display_3.pin8, onAddPin8Button);
  //     }
  //   }
  
  //   function onAddPin8Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin8Button", status))
  //     {
  
  //       addButtonObject(display_3.pin9, onAddPin0Button);
  //     }
  //   }
  //   function onAddPin0Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin8Button", status))
  //     {
  //       addButtonObject(display_3.pin0, onAddPin9Button);
  //     }
  //   }
  
  //   /* Next create the input object for accepting the input from the user */
  //   function onAddPin9Button(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddPin9Button", status))
  //     {
  
  //       inputObj = new wgssSignatureSDK.InputObj(onInputObjCtr);
  //     }
  //   }
  
  //   function onInputObjCtr(inputObjV, status)
  //   {
  //     if (callbackStatusOK("InputObj constructor", status))
  //     {
  //       inputObj.PutMinLength(PIN_MINLENGTH, onInputObjMinLen);
  //     }
  //   }
  
  //   /* The input obj has a minimum and maximum length */
  //   function onInputObjMinLen(inputObjV, status)
  //   {
  //     if (callbackStatusOK("InputObj PutMinLength", status))
  //     {
  //       inputObj.PutMaxLength(PIN_MAXLENGTH, onInputObjMaxLen);
  //     }
  //   }
  
  //   function onInputObjMaxLen(inputObjV, status)
  //   {
  //     if (callbackStatusOK("InputObj PutMaxLength", status))
  //     {
  
  //       addInputObject(inputObj, onAddObjectInput);
  //     }
  //   }
  
  //   // /* Now add the input echo object */
  //   function onAddObjectInput(wizCtlV, status)
  //   {
  //     if (callbackStatusOK("WizCtl addInputObj", status))
  //     {
  //       addInputObjectEcho("centre", display_3.yInputEcho, step3_onAddOK);
  //     }
  //   }
  //   function step3_onAddOK(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddOK", status))
  //     {
  //       var buttonSource = getButtonSourceFromHTMLDoc();
  
  //       if (buttonSource == textSource.STANDARD)
  //       {
  //         addButtonObject(display_2.clearButton, step3_onAddRadioButton2);
  //       }
  //       else
  //       {
  //         addObjectImage(display_2.clearButton, step3_onAddRadioButton2, buttonSource);
  //       }
  //     }
  //   }
  
  //   function step3_onAddRadioButton2(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddRadioButton2", status))
  //     {
  //       var buttonSource = getButtonSourceFromHTMLDoc();
  
  //       if (buttonSource == textSource.STANDARD)
  //       {
  //         // Set up font colours if required for colour pads
  //         if (display_3.cancelButton.fontForeColor != "")
  //         {
  //           setFontForeColor(display_3.cancelButton.fontForeColor, step3_onSetCancelButtonFontForeColor);
  //         }
  //         else
  //         {
  //           addButtonObject(display_3.cancelButton, step3_onAddCancelButton);
  //         }
  //       }
  //       else
  //       {
  //         //print("Adding button as an image from source " + buttonSource);
  //         addObjectImage(display_3.cancelButton, step3_onAddCancelButton, buttonSource);
  //       }
  //     }
  //   }
  
  //   function step3_onSetCancelButtonFontForeColor(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl step3_setFontCancelButtonForeColor", status))
  //     {
  //       setFontBackColor(display_3.cancelButton.fontBackColor, step3_onSetCancelButtonFontBackColor);
  //     }
  //   }
  
  //   function step3_onSetCancelButtonFontBackColor(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl step2_setCancelButtonFontBackColor", status))
  //     {
  //       addButtonObject(display_3.cancelButton, step3_onAddCancelButton);
  //     }
  //   }
  
  //   function step3_onAddCancelButton(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddCancelButton", status))
  //     {
  //       var buttonSource = getButtonSourceFromHTMLDoc();
  
  //       if (buttonSource == textSource.STANDARD)
  //       {
  //         addButtonObject(display_3.nextButton, step3_onAddNextButton);
  //       }
  //       else
  //       {
  //         addObjectImage(display_3.nextButton, step3_onAddNextButton, buttonSource);
  //       }
  //     }
  //   }
  
  //   function step3_onAddNextButton(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl AddNextButton", status))
  //     {
  //       wizCtl.Display(step3_onDisplay);
  //     }
  //   }
  
  //   function step3_onDisplay(wizCtlV, status)
  //   {
  //     if(callbackStatusOK("WizCtl Display", status))
  //     {
  //       wizCtl.SetEventHandler(step3_Handler);
  //     }
  //   }
  // }
  
  /* This is the event handler for the user input on the third screen of the wizard */
  // function step3_Handler(ctl, id, type, status)
  // {
  //   if(wgssSignatureSDK.ResponseStatus.OK == status)
  //   {
  //     switch(id)
  //     {
  //       case "input":
  //         switch (type)
  //         {
  
  //           case 4:
  
  //             break; //print("min chars entered")
  //           case 5:
  
  //             break; //print("max chars entered")
  //           case 6:
  
  //             break; //print("attempted to exceed min/max chars")
  //           default:
  //             print("Input unexpected type: " + Type);
  //             break;
  //         }
  //         break;
  //     case buttonEvent.CLEAR:
  //       break; // handled by the InputObj control
  //     case buttonEvent.OK:
  //       inputObj.GetText(onInputObjGetText);
  //       step4();
  //       break;
  //     case buttonEvent.CANCEL:
  //       print("Previous");
  //       step2();
  //       // wizardEventController.script_Completed(true);
  //       break;
  //     default:
  //       print( "Exception: step3_Handler(): " + "unexpected event: " + id);
  //       break;
  //     }
  //   }
  //   else
  //   {
  //     print("Wizard window closed");
  //     wizardEventController.script_Cancelled();
  //   }
  
  // }
  
  /* The function step4() is the controlling routine for setting up and displaying the objects
     on the fourth screen in the wizard sequence, i.e. the one with the radio buttons */
  // function step4() {
  //   wizCtl.Reset(step4_onWizCtlReset);
  
  //   function step4_onWizCtlReset(wizCtlV, status) {
  //     if (wgssSignatureSDK.ResponseStatus.OK == status) {
  //       var buttonTextSource = textSource.LOCAL;
  //       display_4 = new screen_Display4(pad, buttonTextSource);
  //       setFont(
  //         display_4.stepMsg4.fontName,
  //         display_4.stepMsg4.fontSize,
  //         display_4.stepMsg4.fontWeight,
  //         false,
  //         step4_onPutFont
  //       );
  //     } else {
  //       print("WizCtl Reset" + status);
  //       if (wgssSignatureSDK.ResponseStatus.INVALID_SESSION == status) {
  //         actionWhenRestarted(window.Step4);
  //       }
  //     }
  //   }
  
  //   function step4_onPutFont(wizCtlV, status) {
  //     var fontForeColor = "";
  
  //     if (callbackStatusOK("WizCtl PutFont", status)) {
  //       // In case font colours were changed on the previous screen make sure we revert to black on white now
  //       if (pad.Range == padRange.STU5X0) {
  //         if (display_4.stepMsg4.fontForeColor != "") {
  //           fontForeColor = display_4.stepMsg4.fontForeColor;
  //         } else {
  //           fontForeColor = padColors.BLACK;
  //         }
  //         setFontForeColor(fontForeColor, step4_onSetStepMsg2FontForeColor);
  //       } else {
  //         // For monochrome pads skip the setting of font colours
  //         addTextObject(display_4.stepMsg4, step4_onAddText1);
  //       }
  //     }
  //   }
  
  //   function step4_onSetStepMsg2FontForeColor(wizCtlV, status) {
  //     var fontBackColor;
  
  //     if (callbackStatusOK("WizCtl setStepMsg2FontForeColor", status)) {
  //       if (display_4.stepMsg4.fontBackColor != "") {
  //         fontBackColor = display_4.stepMsg4.fontBackColor;
  //       } else {
  //         fontBackColor = padColors.WHITE;
  //       }
  //       setFontBackColor(fontBackColor, step4_onSetStepMsg2FontBackColor);
  //     }
  //   }
  
  //   function step4_onSetStepMsg2FontBackColor(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl setStepMsg2FontBackColor", status)) {
  //       addTextObject(display_4.stepMsg4, step4_onAddText1);
  //     }
  //   }
  
  //   function step4_onAddText1(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddObject", status)) {
  //       if (pad.Range == padRange.STU300) {
  //         addLine(display_4.step1Line, step4_onAddPrimitive1);
  //       } else {
  //         addRectangle(display_4.step1Rectangle, step4_onAddText4);
  //       }
  //     }
  //   }
  
  //   function step4_onAddText4(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddText4", status)) {
  //       setFont(
  //         pad.Font,
  //         pad.ButtonSize,
  //         pad.TextBold,
  //         false,
  //         step4_onAddTextEnter
  //       );
  //     }
  //   }
  //   ///From Display 3
  //   function step4_onAddTextEnter(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddText4", status)) {
  //       setFont(
  //         display_4.enterBelow.fontName,
  //         display_4.enterBelow.fontSize,
  //         display_4.enterBelow.fontBold,
  //         false,
  //         onPutFontEnterBelow
  //       );
  //     }
  //   }
  
  //   function onPutFontEnterBelow(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl PutFontEnterBelow", status)) {
  //       // If font colour is required do it now
  //       if (
  //         display_4.enterBelow.fontForeColor != null &&
  //         display_4.enterBelow.fontForeColor != ""
  //       ) {
  //         setFontForeColor(
  //           display_4.enterBelow.fontForeColor,
  //           step4_onSetFontForeColorEnterBelow
  //         );
  //       } else {
  //         addTextObject(display_4.enterBelow, onAddEnterBelow);
  //       }
  //     }
  //   }
  
  //   function step4_onSetFontForeColorEnterBelow(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl SetFontForeColorEnterBelow", status)) {
  //       // If a foreground colour has been set then we assume a background colour must also be required
  //       setFontBackColor(
  //         display_4.enterBelow.fontBackColor,
  //         step4_onSetFontBackColorEnterBelow
  //       );
  //     }
  //   }
  
  //   function step4_onSetFontBackColorEnterBelow(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl SetFontBackColorEnterBelow", status)) {
  //       // After setting up the font colours set up the text string itself
  //       addTextObject(display_4.enterBelow, step4_onAddEnterBelow);
  //     }
  //   }
  
  //   /* Next 9 functions - add the buttons for the 9 PINs */
  //   function step4_onAddEnterBelow(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl step1 AddEnterBelow", status)) {
  //       // If font colour is required do it now
  //       if (
  //         display_4.pin1.fontForeColor != null &&
  //         display_4.pin1.fontForeColor != ""
  //       ) {
  //         setFontForeColor(
  //           display_4.pin1.fontForeColor,
  //           step4_onSetFontForeColorPin1
  //         );
  //       } else {
  //         addButtonObject(display_4.pin1, step4_onAddPin1Button);
  //       }
  //     }
  //   }
  
  //   function step4_onSetFontForeColorPin1(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl SetFontForeColorPin1", status)) {
  //       // If a foreground colour has been set then we assume a background colour must also be required
  //       setFontBackColor(
  //         display_4.pin1.fontBackColor,
  //         step4_onSetFontBackColorPin1
  //       );
  //     }
  //   }
  
  //   function step4_onSetFontBackColorPin1(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl SetFontBackColorPin1", status)) {
  //       // After setting up the font colours set up the text string itself
  //       addButtonObject(display_4.pin1, step4_onAddPin1Button);
  //     }
  //   }
  
  //   function step4_onAddPin1Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl PutFontEnterBelow", status)) {
  //       addButtonObject(display_4.pin2, onAddPin2Button);
  //     }
  //   }
  
  //   function onAddPin2Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin2Button", status)) {
  //       addButtonObject(display_4.pin3, onAddPin3Button);
  //     }
  //   }
  
  //   function onAddPin3Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin3Button", status)) {
  //       addButtonObject(display_4.pin4, onAddPin4Button);
  //     }
  //   }
  
  //   function onAddPin4Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin4Button", status)) {
  //       addButtonObject(display_4.pin5, onAddPin5Button);
  //     }
  //   }
  
  //   function onAddPin5Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin5Button", status)) {
  //       addButtonObject(display_4.pin6, onAddPin6Button);
  //     }
  //   }
  
  //   function onAddPin6Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin6Button", status)) {
  //       addButtonObject(display_4.pin7, onAddPin7Button);
  //     }
  //   }
  
  //   function onAddPin7Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin7Button", status)) {
  //       addButtonObject(display_4.pin8, onAddPin8Button);
  //     }
  //   }
  
  //   function onAddPin8Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin8Button", status)) {
  //       addButtonObject(display_4.pin9, onAddPin0Button);
  //     }
  //   }
  //   function onAddPin0Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin8Button", status)) {
  //       addButtonObject(display_4.pin0, onAddPin9Button);
  //     }
  //   }
  
  //   /* Next create the input object for accepting the input from the user */
  //   function onAddPin9Button(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddPin9Button", status)) {
  //       inputObj = new wgssSignatureSDK.InputObj(onInputObjCtr);
  //     }
  //   }
  
  //   function onInputObjCtr(inputObjV, status) {
  //     if (callbackStatusOK("InputObj constructor", status)) {
  //       inputObj.PutMinLength(PIN_MINLENGTH, onInputObjMinLen);
  //     }
  //   }
  
  //   /* The input obj has a minimum and maximum length */
  //   function onInputObjMinLen(inputObjV, status) {
  //     if (callbackStatusOK("InputObj PutMinLength", status)) {
  //       inputObj.PutMaxLength(PIN_MAXLENGTH, onInputObjMaxLen);
  //     }
  //   }
  
  //   function onInputObjMaxLen(inputObjV, status) {
  //     if (callbackStatusOK("InputObj PutMaxLength", status)) {
  //       addInputObject(inputObj, onAddObjectInput);
  //     }
  //   }
  
  //   // /* Now add the input echo object */
  //   function onAddObjectInput(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl addInputObj", status)) {
  //       addInputObjectEcho("centre", display_4.yInputEcho, step4_onAddOK);
  //     }
  //   }
  //   function step4_onAddOK(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddOK", status)) {
  //       var buttonSource = getButtonSourceFromHTMLDoc();
  
  //       if (buttonSource == textSource.STANDARD) {
  //         addButtonObject(display_2.clearButton, step4_onAddRadioButton2);
  //       } else {
  //         addObjectImage(
  //           display_2.clearButton,
  //           step4_onAddRadioButton2,
  //           buttonSource
  //         );
  //       }
  //     }
  //   }
  
  //   function step4_onAddRadioButton2(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddRadioButton2", status)) {
  //       var buttonSource = getButtonSourceFromHTMLDoc();
  
  //       if (buttonSource == textSource.STANDARD) {
  //         // Set up font colours if required for colour pads
  //         if (display_2.cancelButton.fontForeColor != "") {
  //           setFontForeColor(
  //             display_4.cancelButton.fontForeColor,
  //             step4_onSetCancelButtonFontForeColor
  //           );
  //         } else {
  //           addButtonObject(display_4.cancelButton, step4_onAddCancelButton);
  //         }
  //       } else {
  //         //print("Adding button as an image from source " + buttonSource);
  //         addObjectImage(
  //           display_4.cancelButton,
  //           step4_onAddCancelButton,
  //           buttonSource
  //         );
  //       }
  //     }
  //   }
  
  //   function step4_onSetCancelButtonFontForeColor(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl step2_setFontCancelButtonForeColor", status)) {
  //       setFontBackColor(
  //         display_4.cancelButton.fontBackColor,
  //         step4_onSetCancelButtonFontBackColor
  //       );
  //     }
  //   }
  
  //   function step4_onSetCancelButtonFontBackColor(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl step2_setCancelButtonFontBackColor", status)) {
  //       addButtonObject(display_4.cancelButton, step4_onAddCancelButton);
  //     }
  //   }
  
  //   function step4_onAddCancelButton(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddCancelButton", status)) {
  //       var buttonSource = getButtonSourceFromHTMLDoc();
  
  //       if (buttonSource == textSource.STANDARD) {
  //         addButtonObject(display_4.nextButton, step4_onAddNextButton);
  //       } else {
  //         addObjectImage(
  //           display_4.nextButton,
  //           step4_onAddNextButton,
  //           buttonSource
  //         );
  //       }
  //     }
  //   }
  
  //   function step4_onAddNextButton(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl AddNextButton", status)) {
  //       wizCtl.Display(step4_onDisplay);
  //     }
  //   }
  
  //   function step4_onDisplay(wizCtlV, status) {
  //     if (callbackStatusOK("WizCtl Display", status)) {
  //       wizCtl.SetEventHandler(step4_Handler);
  //     }
  //   }
  // }
  
  /* This is the event handler for the user input on the fourth screen of the wizard */
  
  // function step4_Handler(ctl, id, type, status) {
  //   if (wgssSignatureSDK.ResponseStatus.OK == status) {
  //     switch (id) {
  //       case "input":
  //         switch (type) {
  //           case 4:
  //             break; //print("min chars entered")
  //           case 5:
  //             break; //print("max chars entered")
  //           case 6:
  //             break; //print("attempted to exceed min/max chars")
  //           default:
  //             print("Input unexpected type: " + Type);
  //             break;
  //         }
  //         break;
  //       case buttonEvent.CLEAR:
  //         break; // handled by the InputObj control
  //       case buttonEvent.OK:
  //         inputObj.GetText(onInputObjGetText);
  //         wizardEventController.script_Completed(false);
  //         break;
  //       case buttonEvent.CANCEL:
  //         print("Previous");
  //         step3();
  //         // wizardEventController.script_Completed(true);
  //         break;
  //       default:
  //         print("Exception: step4_Handler(): " + "unexpected event: " + id);
  //         break;
  //     }
  //   } else {
  //     print("Wizard window closed");
  //     wizardEventController.script_Cancelled();
  //   }
  // }
  
  /* The function Step2() is the controlling routine for setting up and displaying the objects
     on the second screen in the wizard sequence i.e. the signature capture itself.
     The objects themselves are set up in SigCaptX-Wizard-PadDefs.js */
  function step2() {
    wizCtl.Reset(step2_onWizCtlReset);
  
    function step2_onWizCtlReset(wizCtlV, status) {
      if (callbackStatusOK("WizCtl Reset", status)) {
        var buttonTextSource = textSource.LOCAL;
        display_2 = new screen_Display2(pad, buttonTextSource);
        setFont(
          display_2.stepMsg2.fontName,
          display_2.stepMsg2.fontSize,
          display_2.stepMsg2.fontBold,
          false,
          step2_onPutFont
        );
      }
    }
  
    function step2_onPutFont(wizCtlV, status) {
      var fontForeColor;
  
      if (callbackStatusOK("WizCtl step4 PutFont", status)) {
        // In case font colours were changed on the previous screen make sure we revert to black on white now
  
        if (pad.Range == padRange.STU5X0) {
          if (display_2.stepMsg1.fontForeColor != "") {
            fontForeColor = display_2.stepMsg2.fontForeColor;
          } else {
            fontForeColor = padColors.BLACK;
          }
          setFontForeColor(fontForeColor, step2_onSetStepMsg2FontForeColor);
        } else {
          addTextObject(display_2.stepMsg2, step2_onAddText1);
        }
      }
    }
  
    function step2_onSetStepMsg2FontForeColor(wizCtlV, status) {
      var fontBackColor;
  
      if (callbackStatusOK("WizCtl setStepMsg4FontForeColor", status)) {
        if (display_2.stepMsg2.fontBackColor != "") {
          fontBackColor = display_2.stepMsg1.fontBackColor;
        } else {
          fontBackColor = padColors.WHITE;
        }
        setFontBackColor(fontBackColor, step2_onSetStepMsg2FontBackColor);
      }
    }
  
    function step2_onSetStepMsg2FontBackColor(wizCtlV, status) {
      if (callbackStatusOK("WizCtl setStepMsg4FontBackColor", status)) {
        addTextObject(display_2.stepMsg2, step2_onAddText1);
      }
    }
  
    function step2_onAddText1(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddText1", status)) {
        /* Because of the very different dimensions of the STU 300 we have to have use a different layout for the buttons and text etc
           so there are separate routines just for the 300 */
        if (padType.STU300 == pad.Type) {
          step4_isSTU300();
        } else {
          step4_notSTU300();
        }
      }
    }
  
    function step4_notSTU300() {
      addRectangle(display_2.step1Rectangle, step2_onAddPrimitive1);
    }
  
    function step2_onAddPrimitive1(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddPrimitive", status)) {
        setFont(
          display_2.pleaseSign.fontName,
          display_2.pleaseSign.fontSize,
          display_2.pleaseSign.fontBold,
          false,
          step2_onPutFont2
        );
      }
    }
  
    function step2_onPutFont2(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFont2", status)) {
        /* If we are using a colour pad then set the colour of the foreground and background fonts up now if defined in the text object */
        if (display_2.pleaseSign.fontForeColor != "") {
          setFontForeColor(
            display_2.pleaseSign.fontForeColor,
            step2_onSetFontForeColorPleaseSign
          );
        } else {
          addTextObject(display_2.pleaseSign, step2_onAddText2);
        }
      }
    }
  
    function step2_onSetFontForeColorPleaseSign(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontForeColorPleaseSign", status)) {
        // If a foreground colour has been set then we assume a background colour must also be required
        setFontBackColor(
          display_2.pleaseSign.fontBackColor,
          step2_onSetFontBackColorPleaseSign
        );
      }
    }
  
    function step2_onSetFontBackColorPleaseSign(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontBackColorPleaseSign", status)) {
        // After setting up the font colours set up the text string itself
        addTextObject(display_2.pleaseSign, step2_onAddText2);
      }
    }
  
    function step2_onAddText2(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddText2", status)) {
        setFont(
          display_2.XMark.fontName,
          display_2.XMark.fontSize,
          display_2.XMark.fontBold,
          false,
          step2_onPutFontXMark
        );
      }
    }
  
    function step2_onPutFontXMark(wizCtlV, status) {
      if (callbackStatusOK("WizCtl FontXMark", status)) {
        /* If we are using a colour pad then set the colour of the foreground and background fonts up now if defined in the text object */
        if (display_2.XMark.fontForeColor != "") {
          setFontForeColor(
            display_2.XMark.fontForeColor,
            step2_onSetFontForeColorXMark
          );
        } else {
          addTextObject(display_2.XMark, step2_onAddTextXMark);
        }
      } else {
        addTextObject(display_2.XMark, step2_onAddTextXMark);
      }
    }
  
    function step2_onSetFontForeColorXMark(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontForeColorXMark", status)) {
        // If a foreground colour has been set then we assume a background colour must also be required
        setFontBackColor(
          display_2.XMark.fontBackColor,
          step2_onSetFontBackColorXMark
        );
      }
    }
  
    function step2_onSetFontBackColorXMark(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontBackColorXMark", status)) {
        // After setting up the font colours set up the text string itself
        addTextObject(display_2.XMark, step2_onAddTextXMark);
      }
    }
  
    function step2_onAddTextXMark(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddTextXMark", status)) {
        addTextObject(display_2.sigMarkerLine, step2_onAddMarkerLine);
      }
    }
  
    function step2_onAddMarkerLine(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddMarkerLine", status)) {
        setFont(
          pad.Font,
          display_2.signatureFontSize,
          pad.TextBold,
          false,
          step2_onPutSignatureFont
        );
      }
    }
  
    function step2_onPutSignatureFont(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutSignatureFont", status)) {
        addSignatureObject(sigCtl, step2_onAddSignature);
      }
    }
  
    function step2_onAddSignature(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddSignature", status)) {
        /* If we are using a colour pad then set the colour of the foreground and background fonts up now if defined in the text object */
        if (display_2.why.fontForeColor != "") {
          setFontForeColor(
            display_2.why.fontForeColor,
            step2_onSetFontForeColorWhy
          );
        } else {
          addTextObject(display_2.who, step2_onAddWho);
        }
      } else {
        addTextObject(display_2.who, step2_onAddWho);
      }
    }
  
    function step2_onSetFontForeColorWhy(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontForeColorWhy", status)) {
        // If a foreground colour has been set then we assume a background colour must also be required
        setFontBackColor(
          display_2.why.fontBackColor,
          step2_onSetFontBackColorWhy
        );
      }
    }
  
    function step2_onSetFontBackColorWhy(wizCtlV, status) {
      if (callbackStatusOK("WizCtl SetFontBackColorWhy", status)) {
        // After setting up the font colours set up the text string itself
        addTextObject(display_2.who, step2_onAddWho);
      }
    }
  
    function step2_onAddWho(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddWho", status)) {
        addTextObject(display_2.why, step2_onAddWhy);
      }
    }
  
    function step2_onAddWhy(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddWhy", status)) {
        setFont(
          display_2.okButton.fontName,
          display_2.okButton.buttonSize,
          display_2.okButton.fontBold,
          false,
          step2_onPutFontOK
        );
      }
    }
  
    function step2_onPutFontOK(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFontOK", status)) {
        var buttonSource = getButtonSourceFromHTMLDoc();
  
        if (buttonSource == textSource.STANDARD) {
          // Set up font colours if required for colour pads
          if (display_2.okButton.fontForeColor != "") {
            setFontForeColor(
              display_2.okButton.fontForeColor,
              step2_onSetOKButtonFontForeColor
            );
          } else {
            addButtonObject(display_2.okButton, step2_onAddOK);
          }
        } else {
          addObjectImage(display_2.okButton, step2_onAddOK, buttonSource);
        }
      }
  
      function step2_onSetOKButtonFontForeColor(wizCtlV, status) {
        if (callbackStatusOK("WizCtl step5 setFontOKButtonForeColor", status)) {
          setFontBackColor(
            display_2.okButton.fontBackColor,
            step2_onSetOKButtonFontBackColor
          );
        }
      }
  
      function step2_onSetOKButtonFontBackColor(wizCtlV, status) {
        if (callbackStatusOK("WizCtl step5_setOKButtonFontBackColor", status)) {
          addButtonObject(display_2.okButton, step2_onAddOK);
        }
      }
    }
  
    function step2_onAddOK(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddOK", status)) {
        var buttonSource = getButtonSourceFromHTMLDoc();
  
        if (buttonSource == textSource.STANDARD) {
          addButtonObject(display_2.clearButton, step2_onAddClear);
        } else {
          addObjectImage(display_2.clearButton, step2_onAddClear, buttonSource);
        }
      }
    }
  
    function step2_onAddClear(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddClear", status)) {
        var buttonSource = getButtonSourceFromHTMLDoc();
  
        if (buttonSource == textSource.STANDARD) {
          addButtonObject(display_2.cancelButton, step2_doDisplay);
        } else {
          addObjectImage(display_2.cancelButton, step2_doDisplay, buttonSource);
        }
      }
    }
  
    // The following group of functions are only applicable to the STU 300
  
    function step1_isSTU300() {
      addLine(display_2.line, step2_onAddPrimitiveSTU300);
    }
  
    // STU 300
    function step2_onAddPrimitiveSTU300(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddPrimitiveSTU300", status)) {
        setFont(
          display_2.penSymbol.fontName,
          display_2.penSymbol.fontSize,
          pad.TextBold,
          wgssSignatureSDK.FontCharset.SYMBOL_CHARSET,
          step2_onPutFontPenSymbol
        );
      }
    }
  
    // STU 300
    function step2_onPutFontPenSymbol(wizCtlV, status) {
      if (callbackStatusOK("WizCtl PutFontPenSymbol", status)) {
        wizCtl.GetFont(step2_onGetFontSTU300);
      }
    }
  
    // STU 300
    function step2_onGetFontSTU300(wizCtlV, font, status) {
      if (callbackStatusOK("WizCtl GetFontSTU300", status)) {
        addTextObject(display_2.penSymbol, step2_onAddText1STU300);
      }
    }
  
    // STU 300
    function step2_onAddText1STU300(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddText1STU300", status)) {
        setFont(
          pad.Font,
          pad.signatureFontSize,
          wgssSignatureSDK.FontWeight.FW_NORMAL,
          false,
          step2_onPutSignatureFont
        );
      }
    }
    // end of STU300 functions
  
    // These next 2 functions are called regardless of the STU currently in use
    function step2_doDisplay(wizCtlV, status) {
      if (callbackStatusOK("WizCtl AddCancelButton", status)) {
        wizCtl.Display(step2_onDisplay);
      }
    }
  
    function step2_onDisplay(wizCtlV, status) {
      if (callbackStatusOK("WizCtl Display", status)) {
        wizCtl.SetEventHandler(step2_Handler);
      }
    }
  }
  
  /* This is the event handler for the user input on the second screen of the wizard i.e. signature capture*/
  // function step2_Handler(ctl, id, type, status)
  // {
  //   if(wgssSignatureSDK.ResponseStatus.OK == status)
  //   {
  //     switch(id) {
  //       case buttonEvent.OK:
  //         print("OK selected");
  //         // step3();
  //         inputObj.GetText(onInputObjGetText);
  //       wizardEventController.script_Completed(false);
  
  //         // wizardEventController.script_Completed(false);
  //         break;
  //       case buttonEvent.CLEAR:
  //         print("Clear");
  //         break;
  //       case buttonEvent.CANCEL:
  //         print("Previous");
  //         step1();
  //         // wizardEventController.script_Cancelled();
  //         break;
  //       default:
  //         alert("Unexpected event: " + id);
  //         break;
  //     }
  //   }
  //   else
  //   {
  //     print("Wizard window closed");
  //     wizardEventController.script_Cancelled();
  //   }
  // }
  function step2_Handler(ctl, id, type, status) {
    if (wgssSignatureSDK.ResponseStatus.OK == status) {
      switch (id) {
        case "input":
          switch (type) {
            case 4:
              break; //print("min chars entered")
            case 5:
              break; //print("max chars entered")
            case 6:
              break; //print("attempted to exceed min/max chars")
            default:
              print("Input unexpected type: " + Type);
              break;
          }
          break;
        case buttonEvent.CLEAR:
          break; // handled by the InputObj control
        case buttonEvent.OK:
          inputObj.GetText(onInputObjGetText);
          wizardEventController.script_Completed(false);
          break;
        case buttonEvent.CANCEL:
          print("Previous");
          step3();
          // wizardEventController.script_Completed(true);
          break;
        default:
          print("Exception: step4_Handler(): " + "unexpected event: " + id);
          break;
      }
    } else {
      print("Wizard window closed");
      wizardEventController.script_Cancelled();
    }
  }
  
  /* Check the HTML document to see whether the user has selected the option to use local or remote images for the button design */
  function getButtonSourceFromHTMLDoc() {
    var buttonSource = textSource.STANDARD;
  
    if (document.getElementById("local").checked) {
      buttonSource = textSource.LOCAL;
    } else {
      if (document.getElementById("remote").checked) {
        buttonSource = textSource.REMOTE;
      }
    }
    return buttonSource;
  }
  function onInputObjGetText(inputObjV, text, status) {
    if (wgssSignatureSDK.ResponseStatus.OK == status) {
      print("Code entered: " + text);
    } else {
      print("InputObj GetText error: " + status);
      wizardEventController.script_Cancelled();
    }
  }
  