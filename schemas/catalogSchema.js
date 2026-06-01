export const catalogSchema = 
{
    "$id": "http://example.com/example.json",
    "title": "Root Schema",
    "type": "object",
    "required": [
        "errors",
        "data"
    ],
    "properties": {
        "errors": {
            "title": "The errors Schema",
            "type": "array",
            "items": {}
        },
        "data": {
            "title": "The data Schema",
            "type": "object",
            "required": [
                "catalogData"
            ],
            "properties": {
                "catalogData": {
                    "title": "The catalogData Schema",
                    "type": "object",
                    "required": [
                        "session",
                        "cacheTimestamp"
                    ],
                    "properties": {
                        "session": {
                            "title": "The session Schema",
                            "type": "array",
                            "items": {
                                "title": "A Schema",
                                "type": "object",
                                "required": [
                                    "sessionPublished",
                                    "sessionID",
                                    "title",
                                    "type",
                                    "Track",
                                    "abstract",
                                    "Session-Highlight",
                                    "sessionTime",
                                    "speaker",
                                    "agendaItem",
                                    "surveyAvailable",
                                    "isAllDaySession",
                                    
                                    "status",
                                    "abbreviation",
                                    "Industry",
                                    "sessionLinks",
                                    "customFields"
                                ],
                                "properties": {
                                    "sessionPublished": {
                                        "title": "The sessionPublished Schema",
                                        "type": "string"
                                    },
                                    "sessionID": {
                                        "title": "The sessionID Schema",
                                        "type": "string"
                                    },
                                    "title": {
                                        "title": "The title Schema",
                                        "type": "string"
                                    },
                                    "type": {
                                        "title": "The type Schema",
                                        "type": "string"
                                    },
                                    "Track": {
                                        "title": "The Track Schema",
                                        "type": "array",
                                        "items": {
                                            "title": "A Schema",
                                            "type": "string"
                                        }
                                    },
                                    "abstract": {
                                        "title": "The abstract Schema",
                                        "type": "string"
                                    },
                                    "Session-Highlight": {
                                        "title": "The Session-Highlight Schema",
                                        "type": "string"
                                    },
                                    "sessionTime": {
                                        "title": "The sessionTime Schema",
                                        "type": "object",
                                        "required": [
                                            "room"
                                        ],
                                        "properties": {
                                            "room": {
                                                "title": "The room Schema",
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "speaker": {
                                        "title": "The speaker Schema",
                                        "type": "array",
                                        "items": {
                                            "title": "A Schema",
                                            "type": "object",
                                            "required": [
                                                "fullName"
                                            ],
                                            "properties": {
                                                "fullName": {
                                                    "title": "The fullName Schema",
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    },
                                    "agendaItem": {
                                        "title": "The agendaItem Schema",
                                        "type": "boolean"
                                    },
                                    "surveyAvailable": {
                                        "title": "The surveyAvailable Schema",
                                        "type": "boolean"
                                    },
                                    "isAllDaySession": {
                                        "title": "The isAllDaySession Schema",
                                        "type": "boolean"
                                    },
                                    
                                    "status": {
                                        "title": "The status Schema",
                                        "type": "string"
                                    },
                                    "abbreviation": {
                                        "title": "The abbreviation Schema",
                                        "type": "string"
                                    },
                                    "Industry": {
                                        "title": "The Industry Schema",
                                        "type": "array",
                                        "items": {}
                                    },
                                    "sessionLinks": {
                                        "title": "The sessionLinks Schema",
                                        "type": "array",
                                        "items": {}
                                    },
                                    "customFields": {
                                        "title": "The customFields Schema",
                                        "type": "object",
                                        "required": [],
                                        "properties": {
                                        "Area of Interest": {
                                        "title": "The Area of Interest Schema",
                                        "type": "object"
                                    }
                                        }
                                    }
                                }
                            }
                        },
                        "cacheTimestamp": {
                            "title": "The cacheTimestamp Schema",
                            "type": "string"
                        }
                    }
                }
            }
        }
    }
}