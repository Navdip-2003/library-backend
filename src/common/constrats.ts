export const db_collections = {
    user: {
        auth: 'user_auth',
        profile: 'user_profile'
    }
}

export const message = {
    error: {
        something_went_wrong: 'Something went wrong',
        add_user_auth_failure: 'Something went wrong while saving user auth!',
        save_user_profile_failure: 'Something went wrong while saving user profile!',
        invalid_username_password: 'Invalid username or password!',
        account_pending_verification: 'Your mobile number is pending to be verified. Please enter OTP on the signup screen',
        user_does_not_exists: 'Oops!! User Does not exists! Please signup to create an account',
        user_does_not_exists_with_mobile_number: 'This mobile number is not registered with us. Please check registered mobile number',
        email_verify_token_is_invalid: 'Oops!! Looks like the link has already expired. Please contact admin',
        email_verify_token_is_expired: 'Sorry!! Your Account Activation window has expired. Please contact admin',
        user_is_already_verified: 'Your account is already activated. Please login to continue',
        duplicate_password: 'Password is same as old password!!',
        invalid_email: 'This email id is not registered with us. Kindly enter registered email id!',
        invalid_institute_id : 'Invalid institute name !',
        institute_not_found : 'Institute with the given ID does not exist',
        invalid_user_status: 'User status is invalid!',
        invalid_mobile_number: 'This mobile number is not registered with us!',
        invalid_university_id : 'Invalid University name !',
        invalid_Program_id : 'Invalid program name !',
        company_not_found : 'Company with the given ID does not exist',
        jobDescription_not_found:'Job Description with the given ID does not exist',
        season_not_found : 'Failed to get the season data!',
        invalid_season_id : 'Invalid season id',
        invalid_JobDescription_id : 'Invalid Job Description name !',
        duplicate_company : 'Company with the same name is already registered',
        duplicate_institute : 'Institute with the same name is already registered',
        university_not_found : 'University with the given ID does not exist',
        duplicate_university : 'University with the same name is already registered',
        jobdescription_not_found : 'JobDescription with the given ID does not exist',
        invalid_setting_id : 'Invalid setting id !',
        invalid_entity_id : 'Invalid entity id !',
        setting_not_found : 'setting with the given id does not exist',
        duplicate_setting : 'setting with the given entity ID already exist',
        duplicate_program : 'Program with the same name is already registered with the given Institute',
        duplicate_version : 'Version with the same name is already exist',
        duplicate_rolename : 'Role name is already exist',
        program_not_found : 'No Programs found with the selected criteria',
        jdstudmapping_not_found : 'JdStudentMapping with the given ID does not exist' ,
        document_not_found : 'The requested data does not exist',
        address_not_found : 'Education with the given ID does not exist',
        education_not_found : 'Education with the given ID does not exist',
        experience_not_found : 'Experience with the given ID does not exist',
        languages_not_found : 'Languages with the given ID does not exist',
        parents_not_found : 'Parents with the given ID does not exist',
        skills_not_found : 'Skills with the given ID does not exist',
        academics_not_found : 'Academics with the given ID does not exist',
        leads_not_found : 'Oops!! No Leads not found',
        industry_not_found : 'Industry with given ID does not exist',
        duplicate_industry : 'Industry with the same name is already registered',
        sector_not_found : 'Sector with given ID does not exist',
        duplicate_sector : 'Sector with the same name is already registered',
        city_not_found : 'city with given ID does not exist',
        duplicate_city : 'city with the same name is already registered',
        jobprofile_not_found : 'jobprofile with given ID does not exist',
        duplicate_jobprofile : 'jobprofile with the same name is already registered',
        skill_not_found : 'skill with given ID does not exist',
        duplicate_skill : 'skill with the same name is already registered',
        role_not_found : 'role with given ID does not exist'
    }
}

export const pageSize : number = 10;
export const BYCRYPT_SALT_COST = 10;
export const JWT_SECRET= 'NDEZDZOfJn';