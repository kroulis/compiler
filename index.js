/* jshint node: true */
/* globals atom */
"use strict";
var exec = require("child_process").exec;
var fs = require("fs");
var parse = require("path").parse;

module.exports = {
    activate: function () {
        atom.commands.add("atom-text-editor", "compiler:compile", compile);
        atom.commands.add("atom-text-editor", "compiler:compileandrun", compileandrun);
        atom.commands.add("atom-text-editor","compiler:fxonoff",fxonoff);
        atom.commands.add(".tree-view .file > .name", "compiler:treeCompile", treeCompile);
        atom.commands.add(".tree-view .file > .name", "compiler:treeCompileandrun", treeCompileandrun);
  },
  config: {
    addCompilingErr: {
      type: "boolean",
      default: true,
      title: "Add compiling_error.txt",
      description: "Add a file named \"compiling_error.txt\" if compiling goes wrong."
    },
    gppOptions: {
      type: "string",
      default: "",
      title: "g++ options",
      description: "g++ command line options"
    },
    gccOptions: {
        type: "string",
        default: "",
        title: "gcc options",
        description: "gcc command line options"
    },
    rubyOptions:{
        type: "string",
        default: "",
        title: "ruby options",
        description: "ruby command line options"
    },
    pythonOptions:{
        type: "string",
        default: "",
        title: "python options",
        description: "python command line options"
    },
    javaOptions:{
        type: "string",
        default: "",
        title: "Java options",
        description: "Java command line options"
    },
    perlOptions:{
        type: "string",
        default: "",
        title: "perl options",
        description: "perl command line options"
    },
    luaOptions:{
        type: "string",
        default: "",
        title: "lua options",
        description: "lua command line options"
    },
    csharpOptions:{
        type: "string",
        default: "",
        title: "CSharp options",
        description: "CSharp command line options"
    },
    effect:{
        title:"Special Effect Status",
        description:"If this checkbox is on, after you compile there will be some special effect.",
        type:"boolean",
        default:true,
    }
  }
};

function compile(treePath) {
     var editor = atom.workspace.getActiveTextEditor();
     if (editor) {
       editor.save();
     }
     var info = parse(typeof treePath == "string" ? treePath : editor.getPath());
     //atom.notifications.add("info", "Full path: "+editor.getPath());
     var comp = getcompilertype(editor.getPath());
     switch (comp)
     {
         case 1:
             {
                 exec("g++ \"" + info.base + "\" -o \"" + info.name + "\" " + atom.config.get("compiler.gppOptions"), { cwd: info.dir }, function (err, stdout, stderr) {
                     if (stderr) {
                         failedpartical();
                         atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                         if (atom.config.get("gpp-compiler.addCompilingErr")) {
                             fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                         }
                     }
                     else {
                         sucesspartical();
                         atom.notifications.add("success", "Compile " + info.name + " Success.");
                     }
                 });
                 break;
             }
         case 2:
             {
                 exec("gcc \"" + info.base + "\" -o \"" + info.name + "\" " + atom.config.get("compiler.gccOptions"), { cwd: info.dir }, function (err, stdout, stderr) {
                     if (stderr) {
                         failedpartical();
                         atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                         if (atom.config.get("compiler.addCompilingErr")) {
                             fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                         }
                     }
                     else {
                         sucesspartical();
                         atom.notifications.add("success", "Compile " + info.name + " Success.");
                     }
                 });
                 break;
             }
         case 3:
             {
                 atom.notifications.add("Info", "You don't need to compile the webpage. Just press F5 to view it in your browser.");
                 break;
             }
         case 4:
             {
                 atom.notifications.add("Info", "PHP is a script language, Press F5 to run it.");
                 break;
             }
         case 5:
             {
                 atom.notifications.add("Info", "JavaScript is a script language, Press F5 to run it.");
                 break;
             }
         case 6:
             {
               exec("ruby -c \"" + info.name + "\" ", { cwd: info.dir }, function (err, stdout, stderr) {
                   if (stderr) {
                       failedpartical();
                       atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                       if (atom.config.get("compiler.addCompilingErr")) {
                           fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                       }
                   }
                   else {
                       sucesspartical();
                       atom.notifications.add("success", stdout);
                   }
               });
               break;
             }
         case 7:
               {
                 atom.notifications.add("Info", "Python is a script language, Press F5 to run it.");
                 break;
               }
         case 8:
               {
                 exec("javac "+atom.config.get("compiler.javaOptions")+" \"" + info.name + ".java\"", { cwd: info.dir }, function (err, stdout, stderr) {
                     if (stderr) {
                         failedpartical();
                         atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                         if (atom.config.get("compiler.addCompilingErr")) {
                             fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                         }
                     }
                     else {
                         sucesspartical();
                         atom.notifications.add("success", "Compile " + info.name + " Success.");
                     }
                 });
                 break;
               }
         case 9:
               {
                 atom.notifications.add("Info", "Perl is a script language, Press F5 to run it.");
                 break;
               }
         case 10:
             {
                 exec("luac " + atom.config.get("compiler.luaOptions") + " \"" + info.name + ".lua\"", { cwd: info.dir }, function (err, stdout, stderr) {
                     if (stderr) {
                         failedpartical();
                         atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                         if (atom.config.get("compiler.addCompilingErr")) {
                             fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                         }
                     }
                     else {
                         sucesspartical();
                         atom.notifications.add("success", "Compile " + info.name + " Success.");
                     }
                 });
                 break;
             }
         case 11:
             {
                 atom.notifications.add("Info", "C# is a script language, Press F5 to run it.");
                 break;
             }
         default:
             {
                 atom.notifications.add("error", "Unable to identify the programming language from the file extension. Are you sure this is a compilable code?");
             }
     }

}

function compileandrun(treePath) {

    var editor = atom.workspace.getActiveTextEditor();
    if (editor) {
        editor.save();
    }
    var info = parse(typeof treePath == "string" ? treePath : editor.getPath());
    var comp = getcompilertype(editor.getPath());
    switch (comp)
    {
        case 1:
            {
                exec("g++ \"" + info.base + "\" -o \"" + info.name + "\" " + atom.config.get("compiler.gppOptions"), { cwd: info.dir }, function (err, stdout, stderr) {
                    if (stderr) {
                        failedpartical();
                        atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                        if (atom.config.get("compiler.addCompilingErr")) {
                            fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                        }
                    } else {
                        sucesspartical();
                        atom.notifications.add("success", "Compile " + info.name + " Success, now start to run.");
                        if (process.platform == "win32") {
                            exec("start \"" + info.name + "\" \"" + info.name + "\"", {
                                cwd: info.dir
                            });
                        } else if (process.platform == "linux") {
                            exec("gnome-terminal -e \"./" + info.name.replace(/ /g, "\\ ") + "\"", { cwd: info.dir });
                        } else if (process.platform == "darwin") {
                            exec("open \"" + info.name.replace(/ /g, "\\ ") + "\"");
                        }
                        fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                            if (!err) {
                                fs.unlink(info.dir + "/compiling_error.txt");
                            }
                        });
                    }
                });
                break;
            }
        case 2:
            {
                exec("gcc \"" + info.base + "\" -o \"" + info.name + "\" " + atom.config.get("compiler.gccOptions"), { cwd: info.dir }, function (err, stdout, stderr) {
                    if (stderr) {
                        failedpartical();
                        atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                        if (atom.config.get("compiler.addCompilingErr")) {
                            fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                        }
                    } else {
                        sucesspartical();
                        atom.notifications.add("success", "Compile " + info.name + " Success, now start to run.");
                        if (process.platform == "win32") {
                            exec("start \"" + info.name + "\" \"" + info.name + "\"", {
                                cwd: info.dir
                            });
                        } else if (process.platform == "linux") {
                            exec("gnome-terminal -e \"./" + info.name.replace(/ /g, "\\ ") + "\"", { cwd: info.dir });
                        } else if (process.platform == "darwin") {
                            exec("open \"" + info.name.replace(/ /g, "\\ ") + "\"");
                        }
                        fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                            if (!err) {
                                fs.unlink(info.dir + "/compiling_error.txt");
                            }
                        });
                    }
                });
                break;
            }
        case 3:
            {
              if (process.platform == "win32") {
                  exec(editor.getPath());
              } else if (process.platform == "linux") {
                  exec("link "+editor.getPath());
              } else if (process.platform == "darwin") {
                  exec("open "+editor.getPath());
              }
              break;
            }
        case 4:
            {
              exec("php -f "+info.name+".php", { cwd: info.dir }, function (err, stdout, stderr) {
                  if (stderr) {
                      failedpartical();
                      atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                      if (atom.config.get("compiler.addCompilingErr")) {
                          fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                      }
                  } else {
                      sucesspartical();
                      atom.notifications.add("success", "Compile " + info.name + " Success, the result will show in another page.");
                      fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                          if (!err) {
                              fs.unlink(info.dir + "/compiling_error.txt");
                          }
                      });
                      fs.writeFile(info.dir + "/php_"+info.name+"_result.txt", stdout);
                      atom.workspace.open(info.dir + "/php_"+info.name+"_result.txt");
                  }
              });
              break;
            }
        case 5:
            {
              fs.writeFile(info.dir+"/js_"+info.name+"_try.html",  "<html>\n<body>\n Try to run "+info.name+".js <script language=\"JavaScript\" src=\""+info.name+".js\">\n</script>\n</body>\n</html>");
              if (process.platform == "win32") {
                  exec(info.dir+"/js_"+info.name+"_try.html");
              } else if (process.platform == "linux") {
                  exec("link "+info.dir+"/js_"+info.name+"_try.html");
              } else if (process.platform == "darwin") {
                  exec("open "+info.dir+"/js_"+info.name+"_try.html");
              }
              break;
            }
        case 6:
            {
              exec("ruby "+atom.config.get("compiler.rubyOptions")+" \"" + info.name + "\" ", { cwd: info.dir }, function (err, stdout, stderr) {
                  if (stderr) {
                      failedpartical();
                      atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                      if (atom.config.get("compiler.addCompilingErr")) {
                          fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                      }
                  }
                  else {
                      sucesspartical();
                      atom.notifications.add("success", "Syntax OK, now the result will show in another page.");
                      fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                          if (!err) {
                              fs.unlink(info.dir + "/compiling_error.txt");
                          }
                      });
                      fs.writeFile(info.dir + "/ruby_"+info.name+"_result.txt", stdout);
                      atom.workspace.open(info.dir + "/ruby_"+info.name+"_result.txt");
                  }
              });
              break;
            }
        case 7:
            {
              exec("python "+atom.config.get("compiler.pythonOptions")+" \"" + editor.getPath() + "\" ", { cwd: info.dir }, function (err, stdout, stderr) {
                  if (stderr) {
                      failedpartical();
                      atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                      if (atom.config.get("compiler.addCompilingErr")) {
                          fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                      }
                  }
                  else {
                      sucesspartical();
                      atom.notifications.add("success", "Success, now the result will show in another page.");
                      fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                          if (!err) {
                              fs.unlink(info.dir + "/compiling_error.txt");
                          }
                      });
                      fs.writeFile(info.dir + "/python_"+info.name+"_result.txt", stdout);
                      atom.workspace.open(info.dir + "/python_"+info.name+"_result.txt");
                  }
              });
              break;
            }
            case 8:
            {
              exec("javac "+atom.config.get("compiler.javaOptions")+" \"" + info.name + ".java\"", { cwd: info.dir }, function (err, stdout, stderr) {
                  if (stderr) {
                      failedpartical();
                      atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                      if (atom.config.get("compiler.addCompilingErr")) {
                          fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                      }
                  } else {
                      sucesspartical();
                      atom.notifications.add("success", "Compile " + info.name + " Success, now start to run.");
                      exec("java "+info.name,{cwd: info.dir});
                      fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                          if (!err) {
                              fs.unlink(info.dir + "/compiling_error.txt");
                          }
                      });
                  }
              });
              break;
            }
        case 9:
            {
              exec("python "+atom.config.get("compiler.perlOptions")+" \"" + editor.getPath() + "\"", { cwd: info.dir }, function (err, stdout, stderr) {
                  if (stderr) {
                      failedpartical();
                      atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                      if (atom.config.get("compiler.addCompilingErr")) {
                          fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                      }
                  }
                  else {
                      sucesspartical();
                      atom.notifications.add("success", "Success, now the result will show in another page.");
                      fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                          if (!err) {
                              fs.unlink(info.dir + "/compiling_error.txt");
                          }
                      });
                      fs.writeFile(info.dir + "/perl_"+info.name+"_result.txt", stdout);
                      atom.workspace.open(info.dir + "/perl_"+info.name+"_result.txt");
                  }
              });
              break;
            }
        case 10:
            {
                exec("lua \"" + editor.getPath() + "\"", { cwd: info.dir }, function (err, stdout, stderr) {
                    if (stderr) {
                        failedpartical();
                        atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                        if (atom.config.get("compiler.addCompilingErr")) {
                            fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                        }
                    }
                    else {
                        sucesspartical();
                        atom.notifications.add("success", "Success, now the result will show in another page.");
                        fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                            if (!err) {
                                fs.unlink(info.dir + "/compiling_error.txt");
                            }
                        });
                        fs.writeFile(info.dir + "/perl_" + info.name + "_result.txt", stdout);
                        atom.workspace.open(info.dir + "/perl_" + info.name + "_result.txt");
                    }
                });
                break;
            }
        case 11:
            {
                if(process.platform != "win32")
                {
                    failedpartical();
                    atom.notifications.add("warning", "Your platform is not Windows, you cannot compile C# code.");
                }
                else
                {
                    exec("csc /target:winexe " + atom.config.get("compiler.csharpOptions") + " \"" + info.name + ".cs\"", { cwd: info.dir }, function (err, stdout, stderr) {
                        if (stderr) {
                            failedpartical();
                            atom.notifications.add("error", stderr.replace(/\n/g, "<br>"));
                            if (atom.config.get("compiler.addCompilingErr")) {
                                fs.writeFile(info.dir + "/compiling_error.txt", stderr);
                            }
                        } else {
                            sucesspartical();
                            atom.notifications.add("success", "Compile " + info.name + " Success, now start to run.");
                            exec("start \"" + info.name + "\" \"" + info.name + "\"", {
                                cwd: info.dir
                            });
                            fs.readFile(info.dir + "/compiling_error.txt", function (err) {
                                if (!err) {
                                    fs.unlink(info.dir + "/compiling_error.txt");
                                }
                            });
                        }
                    });
                }
                break;
            }
        default:
            {
                failedpartical();
                atom.notifications.add("error", "Unable to identify the programming language from the file extension. Are you sure this is a compilable code?");
            }

    }

}

function treeCompile(e) {
  compile(e.target.getAttribute("data-path"));
}

function treeCompileandrun(e) {
  compileandrun(e.target.getAttribute("data-path"));
}

function getfiletype(file_name) {
    //atom.notifications.add("info", "Full name: "+file_name);
    var result = file_name.split('.').pop().toLowerCase();
    return result;
}

function getcompilertype(file_name)
{
    var type = getfiletype(file_name);
    //atom.notifications.add("info", "Code exception: "+type);
    switch (type)
    {
        case "cpp":
        case "cxx":
        case "cc":
            return 1;
        case "c":
        case "pas":
            return 2;
        case "htm":
        case "html":
        case "shtml":
        case "stm":
            return 3;
        case "php":
            return 4;
        case "js":
            return 5;
        case "rb":
        case "rbw":
        case "ruby":
            return 6;
        case "py":
            return 7;
        case "java":
            return 8;
        case "pl":
            return 9;
        case "lua":
            return 10;
        case "cs":
            return 11;

    }
    return -1;
}

function fxonoff()
{
    var onoff=atom.config.get("compiler.effect");
    //atom.notifications.add("info","The value to the Compiler Special Effect is "+onoff);
    if(onoff)
    {
      atom.config.set("compiler.effect","false");
      atom.notifications.add("info","The Compiler Special Effect now is OFF.");
    }
    else {
      atom.config.set("compiler.effect","true");
      atom.notifications.add("info","The Compiler Special Effect now is ON.");
    }
}

function sucesspartical()
{
    if(atom.config.get("compiler.effect"))
    {
      //unfinished
    }
}

function failedpartical()
{
  if(atom.config.get("compiler.effect"))
  {
      //unfinished
  }
}

function random(left,right)
{
  var base=Math.random()*(right-left+1);
  var result=left+base;
  return result;
}

function fadeIn(elem, speed, opacity){

    speed = speed || 20;
    opacity = opacity || 100;

    elem.style.display = 'block';
    iBase.SetOpacity(elem, 0);

    var val = 0;

    (function(){
        iBase.SetOpacity(elem, val);
        val += 5;
        if (val <= opacity) {
            setTimeout(arguments.callee, speed)
        }
    })();
}

function fadeOut(elem, speed, opacity){

    speed = speed || 20;
    opacity = opacity || 0;

    var val = 100;

    (function(){
        iBase.SetOpacity(elem, val);
        val -= 5;
        if (val >= opacity) {
            setTimeout(arguments.callee, speed);
        }else if (val < 0) {

            elem.style.display = 'none';
        }
    })();
}
