module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
		    dist: {
		        src: [	
		        	'app/**/*.js',	
		        	'!app/app-routes.js',
		        	'!app/**/*controller.js'

		        ],
		        dest: 'assets/build/dmao.js',
		    }            
        },

	    ngAnnotate: {
	        options: {
	            singleQuotes: true,
	        },
	        app1: {
                files: [
                	{
                        expand: true,
                       	src: [	'app/app-routes.js', 
                       			'app/**/*controller.js'
		        		],
                        ext: '.annotated.js', // Dest filepaths will have this extension.
                        extDot: 'last',       // Extensions in filenames begin after the last dot
                    },  
                ],      	
	        },
	    },        

        sass: {
		    dist: {
		        options: {
		            style: 'compressed'
		        },
		        files: {
		            'assets/build/dmao.css': 'assets/build/dmao.scss'
		        }
		    } 
		},

        uglify: {
		    build: {
		        src: 'assets/build/dmao.js',
		        dest: 'assets/build/dmao.min.js'
		    }
		},

		watch: {
			options: {
        		livereload: true,
    		},
			css: {
			    files: ['assets/**/*.*css'],
			    tasks: ['sass'],
			    options: {
			        spawn: false,
			    }
			},
		    scripts: {
		        files: ['app/**/*.js', 
		        		'!app/app-routes.js', 
		        		'!app/**/*controller.js'],
		        tasks: ['concat', 'uglify', 'watch'],
		        options: {
		            spawn: false,
		        },
		    },	
		    angularWithDependencies: {
		        files: ['app/app-routes.js', 
		        		'app/**/*controller.js'],
		        tasks: ['ngAnnotate', 'concat', 'uglify', 'watch'],
		        options: {
		            spawn: false,
		        },
		    }		    
		}	

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-annotate');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'sass', 'uglify', 'watch']);

};