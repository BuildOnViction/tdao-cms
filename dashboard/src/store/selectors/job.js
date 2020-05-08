import { createSelector } from 'reselect'
const getDetailJob = (state) => state.jobs.detail;
export const getDetailJobState = createSelector(
    getDetailJob,
    (job) => job
)


const getExperience = (state) => state.jobs.detail.required_experience;
export const getExperienceState = createSelector(
    [ getExperience ],
    (experiment) => {
        if(experiment){
            return "Cần có kinh nghiệm";
        }else{
            return "Không cần kinh nghiệm";
        }
    }
)

const getSalaryFrom = (state) => state.jobs.detail.salary;
const getSalaryTo = (state) => state.jobs.detail.salary;

export const getSalaryState = createSelector(
    getSalaryFrom,
    getSalaryTo,
    (from, to) => {
        if(from && to){
            return "Từ "+from.from+ " Đến "+ to.to
        }
    }
)

const getJobType = (state) => state.jobs.detail.job_type;

export const getJobTypeState = createSelector(
    getJobType,
    (jobtype) => {
        let job_type="";
        if(jobtype){
            jobtype.forEach(item=>{
                if(item.name){
                    job_type += item.name+", ";
                }
            })
        }
        return job_type;
    }
)



