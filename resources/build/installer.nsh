!macro customInstall
  DetailPrint "Register buttercup URI Handler"
  DeleteRegKey HKCR "buttercup"
  WriteRegStr HKCR "buttercup" "" "URL:buttercup"
  WriteRegStr HKCR "buttercup" "URL Protocol" ""
  WriteRegStr HKCR "buttercup\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "buttercup\shell" "" ""
  WriteRegStr HKCR "buttercup\shell\Open" "" ""
  WriteRegStr HKCR "buttercup\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
