package com.vit.result.calc.service;

import com.vit.result.calc.entity.Result;
import com.vit.result.calc.repository.ResultRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ResultService {
    private final ResultRepository resultRepository;
    public ResultService(ResultRepository resultRepository) { this.resultRepository = resultRepository; }

    public Result saveResult(Result r) {
        setWebTechnology(r, r.getWebTechnologyMseMarks(), r.getWebTechnologyEseMarks());
        setDatabaseManagement(r, r.getDatabaseManagementMseMarks(), r.getDatabaseManagementEseMarks());
        setComputerNetworks(r, r.getComputerNetworksMseMarks(), r.getComputerNetworksEseMarks());
        setSoftwareEngineering(r, r.getSoftwareEngineeringMseMarks(), r.getSoftwareEngineeringEseMarks());
        double total = r.getWebTechnologyTotal() + r.getDatabaseManagementTotal() + r.getComputerNetworksTotal() + r.getSoftwareEngineeringTotal();
        r.setTotalMarks(round(total)); r.setPercentage(round(total / 4)); r.setCgpa(round(r.getPercentage() / 10));
        r.setFinalResult(hasFailedSubject(r) ? "FAIL" : "PASS");
        return resultRepository.save(r);
    }

    public List<Result> getAllResults() { return resultRepository.findAll(); }
    public Optional<Result> getResultByPrn(Integer prn) { return resultRepository.findById(prn); }
    public void deleteResult(Integer prn) { resultRepository.deleteById(prn); }

    private void setWebTechnology(Result r, double mse, double ese) { r.setWebTechnologyMse(weighted(mse, .3)); r.setWebTechnologyEse(weighted(ese, .7)); r.setWebTechnologyTotal(round(r.getWebTechnologyMse() + r.getWebTechnologyEse())); r.setWebTechnologyGrade(grade(r.getWebTechnologyTotal())); }
    private void setDatabaseManagement(Result r, double mse, double ese) { r.setDatabaseManagementMse(weighted(mse, .3)); r.setDatabaseManagementEse(weighted(ese, .7)); r.setDatabaseManagementTotal(round(r.getDatabaseManagementMse() + r.getDatabaseManagementEse())); r.setDatabaseManagementGrade(grade(r.getDatabaseManagementTotal())); }
    private void setComputerNetworks(Result r, double mse, double ese) { r.setComputerNetworksMse(weighted(mse, .3)); r.setComputerNetworksEse(weighted(ese, .7)); r.setComputerNetworksTotal(round(r.getComputerNetworksMse() + r.getComputerNetworksEse())); r.setComputerNetworksGrade(grade(r.getComputerNetworksTotal())); }
    private void setSoftwareEngineering(Result r, double mse, double ese) { r.setSoftwareEngineeringMse(weighted(mse, .3)); r.setSoftwareEngineeringEse(weighted(ese, .7)); r.setSoftwareEngineeringTotal(round(r.getSoftwareEngineeringMse() + r.getSoftwareEngineeringEse())); r.setSoftwareEngineeringGrade(grade(r.getSoftwareEngineeringTotal())); }
    private boolean hasFailedSubject(Result r) { return "F".equals(r.getWebTechnologyGrade()) || "F".equals(r.getDatabaseManagementGrade()) || "F".equals(r.getComputerNetworksGrade()) || "F".equals(r.getSoftwareEngineeringGrade()); }
    private double weighted(double marks, double weight) { return round(marks * weight); }
    private double round(double value) { return Math.round(value * 100.0) / 100.0; }
    private String grade(double marks) { if (marks >= 90) return "O"; if (marks >= 80) return "A+"; if (marks >= 70) return "A"; if (marks >= 60) return "B+"; if (marks >= 50) return "B"; if (marks >= 40) return "C"; return "F"; }
}
