cmd_Release/obj.target/syslog.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m64  -Wl,-soname=syslog.node -o Release/obj.target/syslog.node -Wl,--start-group Release/obj.target/syslog/syslog.o -Wl,--end-group 
