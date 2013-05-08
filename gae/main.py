#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.api import xmpp
import webapp2

class MainHandler(webapp2.RequestHandler):
    
    def say(self, msg):
    	user_address = 'raspipboy.client@gmail.com'
    	status_code = xmpp.send_message(user_address, msg)
        #chat_message_sent = (status_code == xmpp.NO_ERROR)

    def get(self, sentence=None):
    	self.response.write('Hello world!')
        #xmpp.send_invite(client_address)
        msg = "Bonjour de la part de appengine"
        if sentence:
        	self.say(sentence)
        	#self.response.write('<br/>chat_message_sent: ' + str(chat_message_sent))
        #status_code = xmpp.send_message(user_address, msg)
        #chat_message_sent = (status_code == xmpp.NO_ERROR)
        
        

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    webapp2.Route('/say/<sentence>', handler=MainHandler, name='blog-archive'),
], debug=True)
