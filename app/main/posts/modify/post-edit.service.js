module.exports = [
    '_',
    'Util',
    '$translate',
    'Notify',
function (
    _,
    Util,
    $translate,
    Notify
) {
    var PostEditService = {
        cleanTagValues: function (post) {
            _.each(post.post_content, task => {
                _.each(task.fields, field => {
                    if (field.type === 'tags') {
                        let value = angular.copy(field.value);
                        field.value = {value};
                    }
                });
            });
            return post;
        },
        validatePost: function (post, form, tasks) {
            // First get tasks to be validated
            // The post task is always validated
            // Other tasks are only validated if marked completed
            var isPostValid = true;
            var tasks_to_validate = [];

            _.each(tasks, function (task) {
                if (task.type === 'post' || _.contains(post.completed_stages, task.id)) {
                    tasks_to_validate.push(task);
                }
            });

            // Validate Post default fields
            if (!form) {
                return false;
            }

            if (!post.form) {
                return false;
            }

            if (form.title.$invalid) {
                return false;
            }

            if (!form.content || form.content.$invalid) {
                return false;
            }
            // Validate post-translations
            _.each(post.enabled_languages.available, language=>{
                if (!post.translations[language] || !post.translations[language].title) {
                    isPostValid = false;
                    form.translatedTitle.$setDirty();
                }
            })

            // Validate required fields for each task that needs to be validated
            _.each(tasks_to_validate, function (task) {
                var required_attributes = _.where(task.fields, {required: true});

                _.each(required_attributes, function (attribute) {
                    if (attribute.type !== 'title' && attribute.type !== 'description') {
                        if (attribute.input === 'checkbox') {
                            var checkboxValidity = false;
                            _.each(attribute.options, function (option) {
                                if (!_.isUndefined(form['values_' + attribute.id + '_' + option]) && !form['values_' + attribute.id + '_' + option].$invalid) {
                                    checkboxValidity = isPostValid;
                                }
                            });
                            isPostValid = checkboxValidity;
                        } else {

                            if (_.isUndefined(form['values_' + attribute.id]) || form['values_' + attribute.id].$invalid) {
                                if (!_.isUndefined(form['values_' + attribute.id])) {
                                    form['values_' + attribute.id].$dirty = true;
                                }

                                isPostValid = false;
                            }
                        }
                    }
                });
            });
            return isPostValid;
        }
    };

    return Util.bindAllFunctionsToSelf(PostEditService);
}];
