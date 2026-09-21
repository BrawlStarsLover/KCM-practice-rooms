#!/bin/sh
# Local Firebase emulators (never touch live data). Uses the portable JDK in
# tests/.jdk if present, otherwise the system Java (needs 21+).
#   ./emulate.sh          run the rules tests
#   ./emulate.sh serve    keep Firestore + Auth emulators running for the page (open index.html?emulator on localhost)
cd "$(dirname "$0")"
JDK=$(ls -d ../.jdk/*/Contents/Home 2>/dev/null | head -1)
if [ -n "$JDK" ]; then export JAVA_HOME="$(cd "$JDK" && pwd)"; export PATH="$JAVA_HOME/bin:$PATH"; fi
if [ "$1" = "serve" ]; then
  exec npx firebase --config ../../firebase.json emulators:start --only firestore,auth --project practice-rooms-cbbe2
fi
exec npx firebase --config ../../firebase.json emulators:exec --only firestore --project demo-practice-rooms "npm test"
