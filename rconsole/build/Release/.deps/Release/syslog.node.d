cmd_Release/syslog.node := ./gyp-mac-tool flock ./Release/linker.lock c++ -bundle -Wl,-search_paths_first -mmacosx-version-min=10.5 -arch x86_64 -L./Release  -o Release/syslog.node Release/obj.target/syslog/src/syslog.o -undefined dynamic_lookup
